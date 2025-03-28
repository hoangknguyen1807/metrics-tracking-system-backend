import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MetricsService } from '../services';
import {
  CreateDistanceMetricDto,
  CreateTemperatureMetricDto,
  GetChartDataDto,
  GetMetricsDto,
} from '../dto';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiBody,
  getSchemaPath,
} from '@nestjs/swagger';
import { DistanceMetric, TemperatureMetric } from '../entities';
import { DistanceUnit, MetricType, TemperatureUnit } from '../../common/enums';

@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @ApiOperation({ summary: 'Create a new distance metric' })
  @ApiBody({ type: CreateDistanceMetricDto })
  @ApiCreatedResponse({
    description: 'Distance metric has been successfully created.',
    type: DistanceMetric,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @Post('distance')
  createDistanceMetric(@Body() createDto: CreateDistanceMetricDto) {
    return this.metricsService.createDistanceMetric(createDto);
  }

  @ApiOperation({ summary: 'Create a new temperature metric' })
  @ApiBody({ type: CreateTemperatureMetricDto })
  @ApiCreatedResponse({
    description: 'Temperature metric has been successfully created.',
    type: TemperatureMetric,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @Post('temperature')
  createTemperatureMetric(@Body() createDto: CreateTemperatureMetricDto) {
    return this.metricsService.createTemperatureMetric(createDto);
  }

  @ApiOperation({
    summary: 'Get metrics by type with optional unit conversion',
  })
  @ApiOkResponse({
    description:
      'Returns a list of metrics based on the type and optional unit conversion.',
    schema: {
      oneOf: [
        {
          type: 'array',
          items: { $ref: getSchemaPath(DistanceMetric) },
          description: 'List of distance metrics',
          example: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              userId: 'user123',
              date: '2023-10-15T14:30:00Z',
              value: 5.5,
              type: MetricType.DISTANCE,
              unit: DistanceUnit.METER,
              createdAt: '2023-10-15T14:30:00Z',
              updatedAt: '2023-10-15T14:30:00Z',
            },
            {
              id: '123e4567-e89b-12d3-a456-426614174001',
              userId: 'user123',
              date: '2023-10-14T12:30:00Z',
              value: 10.25,
              type: MetricType.DISTANCE,
              unit: DistanceUnit.METER,
              createdAt: '2023-10-14T12:30:00Z',
              updatedAt: '2023-10-14T12:30:00Z',
            },
          ],
        },
        {
          type: 'array',
          items: { $ref: getSchemaPath(TemperatureMetric) },
          description: 'List of temperature metrics',
          example: [
            {
              id: '123e4567-e89b-12d3-a456-426614174002',
              userId: 'user123',
              date: '2023-10-15T14:30:00Z',
              value: 25.5,
              type: MetricType.TEMPERATURE,
              unit: TemperatureUnit.CELSIUS,
              createdAt: '2023-10-15T14:30:00Z',
              updatedAt: '2023-10-15T14:30:00Z',
            },
            {
              id: '123e4567-e89b-12d3-a456-426614174003',
              userId: 'user123',
              date: '2023-10-14T12:30:00Z',
              value: 26.8,
              type: MetricType.TEMPERATURE,
              unit: TemperatureUnit.CELSIUS,
              createdAt: '2023-10-14T12:30:00Z',
              updatedAt: '2023-10-14T12:30:00Z',
            },
          ],
        },
      ],
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input parameters.' })
  @Get()
  getMetrics(@Query() getMetricsDto: GetMetricsDto) {
    return this.metricsService.getMetrics(getMetricsDto);
  }

  @ApiOperation({
    summary: 'Get metrics data for charts with the latest entries per day',
  })
  @ApiOkResponse({
    description:
      'Returns data for charts with the latest entry per day for the specified time period.',
    schema: {
      oneOf: [
        {
          type: 'array',
          items: { $ref: getSchemaPath(DistanceMetric) },
          description: 'Chart data for distance metrics (one entry per day)',
          example: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              userId: 'user123',
              date: '2023-10-15T14:30:00Z',
              value: 5.5,
              type: MetricType.DISTANCE,
              unit: DistanceUnit.METER,
              createdAt: '2023-10-15T14:30:00Z',
              updatedAt: '2023-10-15T14:30:00Z',
            },
            {
              id: '123e4567-e89b-12d3-a456-426614174001',
              userId: 'user123',
              date: '2023-10-14T12:30:00Z',
              value: 10.25,
              type: MetricType.DISTANCE,
              unit: DistanceUnit.METER,
              createdAt: '2023-10-14T12:30:00Z',
              updatedAt: '2023-10-14T12:30:00Z',
            },
            {
              id: '123e4567-e89b-12d3-a456-426614174004',
              userId: 'user123',
              date: '2023-10-13T09:15:00Z',
              value: 7.8,
              type: MetricType.DISTANCE,
              unit: DistanceUnit.METER,
              createdAt: '2023-10-13T09:15:00Z',
              updatedAt: '2023-10-13T09:15:00Z',
            },
          ],
        },
        {
          type: 'array',
          items: { $ref: getSchemaPath(TemperatureMetric) },
          description: 'Chart data for temperature metrics (one entry per day)',
          example: [
            {
              id: '123e4567-e89b-12d3-a456-426614174002',
              userId: 'user123',
              date: '2023-10-15T14:30:00Z',
              value: 25.5,
              type: MetricType.TEMPERATURE,
              unit: TemperatureUnit.CELSIUS,
              createdAt: '2023-10-15T14:30:00Z',
              updatedAt: '2023-10-15T14:30:00Z',
            },
            {
              id: '123e4567-e89b-12d3-a456-426614174003',
              userId: 'user123',
              date: '2023-10-14T12:30:00Z',
              value: 26.8,
              type: MetricType.TEMPERATURE,
              unit: TemperatureUnit.CELSIUS,
              createdAt: '2023-10-14T12:30:00Z',
              updatedAt: '2023-10-14T12:30:00Z',
            },
            {
              id: '123e4567-e89b-12d3-a456-426614174005',
              userId: 'user123',
              date: '2023-10-13T10:20:00Z',
              value: 24.3,
              type: MetricType.TEMPERATURE,
              unit: TemperatureUnit.CELSIUS,
              createdAt: '2023-10-13T10:20:00Z',
              updatedAt: '2023-10-13T10:20:00Z',
            },
          ],
        },
      ],
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input parameters.' })
  @Get('chart')
  getChartData(@Query() getChartDataDto: GetChartDataDto) {
    return this.metricsService.getChartData(getChartDataDto);
  }
}
