import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { DistanceMetric, TemperatureMetric } from '../entities';
import { UnitConversionService } from './unit-conversion.service';
import {
  CreateDistanceMetricDto,
  CreateTemperatureMetricDto,
  GetChartDataDto,
  GetMetricsDto,
} from '../dto';
import { DistanceUnit, MetricType, TemperatureUnit } from '../../common/enums';

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(DistanceMetric)
    private distanceMetricRepository: Repository<DistanceMetric>,
    @InjectRepository(TemperatureMetric)
    private temperatureMetricRepository: Repository<TemperatureMetric>,
    private unitConversionService: UnitConversionService,
  ) {}

  async createDistanceMetric(
    createDto: CreateDistanceMetricDto,
  ): Promise<DistanceMetric> {
    const metric = this.distanceMetricRepository.create(createDto);
    return this.distanceMetricRepository.save(metric);
  }

  async createTemperatureMetric(
    createDto: CreateTemperatureMetricDto,
  ): Promise<TemperatureMetric> {
    const metric = this.temperatureMetricRepository.create(createDto);
    return this.temperatureMetricRepository.save(metric);
  }

  async getMetrics(
    getMetricsDto: GetMetricsDto,
  ): Promise<DistanceMetric[] | TemperatureMetric[]> {
    const { userId, type, distanceUnit, temperatureUnit } = getMetricsDto;

    if (type === MetricType.DISTANCE) {
      const metrics = await this.distanceMetricRepository.find({
        where: { userId, type },
        order: { date: 'DESC' },
      });

      if (distanceUnit) {
        return metrics.map((metric) => {
          const convertedValue = this.unitConversionService.convertDistance(
            metric.value,
            metric.unit,
            distanceUnit,
          );

          return {
            ...metric,
            value: convertedValue,
            unit: distanceUnit,
          };
        });
      }

      return metrics;
    } else if (type === MetricType.TEMPERATURE) {
      const metrics = await this.temperatureMetricRepository.find({
        where: { userId, type },
        order: { date: 'DESC' },
      });

      if (temperatureUnit) {
        return metrics.map((metric) => {
          const convertedValue = this.unitConversionService.convertTemperature(
            metric.value,
            metric.unit,
            temperatureUnit,
          );

          return {
            ...metric,
            value: convertedValue,
            unit: temperatureUnit,
          };
        });
      }

      return metrics;
    }

    throw new NotFoundException(`Metrics of type ${type} not found`);
  }

  async getChartData(getChartDataDto: GetChartDataDto): Promise<any[]> {
    const { userId, type, months, distanceUnit, temperatureUnit } =
      getChartDataDto;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));

    let results: any[] = [];

    if (type === MetricType.DISTANCE) {
      // Get the latest entry for each day
      results = await this.getLatestDailyDistanceMetrics(
        userId,
        startDate,
        endDate,
      );

      if (distanceUnit) {
        results = results.map((item) => {
          const convertedValue = this.unitConversionService.convertDistance(
            item?.value || 0,
            item?.unit as DistanceUnit,
            distanceUnit,
          );

          return {
            ...item,
            value: convertedValue,
            unit: distanceUnit,
          };
        });
      }
    } else if (type === MetricType.TEMPERATURE) {
      // Get the latest entry for each day
      results = await this.getLatestDailyTemperatureMetrics(
        userId,
        startDate,
        endDate,
      );

      if (temperatureUnit) {
        results = results.map((item) => {
          const convertedValue = this.unitConversionService.convertTemperature(
            item?.value || 0,
            item.unit as TemperatureUnit,
            temperatureUnit,
          );

          return {
            ...item,
            value: convertedValue,
            unit: temperatureUnit,
          };
        });
      }
    }

    return results;
  }

  private async getLatestDailyDistanceMetrics(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any[]> {
    const metrics = await this.distanceMetricRepository.find({
      where: {
        userId,
        date: Between(startDate, endDate),
      },
      order: { date: 'DESC' },
    });

    // Group by day and get the latest entry for each day
    const dailyMetrics = new Map<string, DistanceMetric>();

    metrics.forEach((metric) => {
      const dateString = metric.date.toISOString().split('T')[0]; // YYYY-MM-DD
      if (!dailyMetrics.has(dateString)) {
        dailyMetrics.set(dateString, metric);
      }
    });

    return Array.from(dailyMetrics.values());
  }

  private async getLatestDailyTemperatureMetrics(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any[]> {
    const metrics = await this.temperatureMetricRepository.find({
      where: {
        userId,
        date: Between(startDate, endDate),
      },
      order: { date: 'DESC' },
    });

    // Group by day and get the latest entry for each day
    const dailyMetrics = new Map<string, TemperatureMetric>();

    metrics.forEach((metric) => {
      const dateString = metric.date.toISOString().split('T')[0]; // YYYY-MM-DD
      if (!dailyMetrics.has(dateString)) {
        dailyMetrics.set(dateString, metric);
      }
    });

    return Array.from(dailyMetrics.values());
  }
}
