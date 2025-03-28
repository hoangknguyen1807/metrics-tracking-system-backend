import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistanceMetric, TemperatureMetric } from './entities';
import { MetricsController } from './controllers';
import { MetricsService, UnitConversionService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([DistanceMetric, TemperatureMetric])],
  controllers: [MetricsController],
  providers: [MetricsService, UnitConversionService],
})
export class MetricsModule {}
