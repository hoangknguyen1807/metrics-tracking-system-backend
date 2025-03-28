import { Column, Entity } from 'typeorm';
import { Metric } from './metric.entity';
import { MetricType, TemperatureUnit } from '../../common/enums';
import { ApiProperty } from '@nestjs/swagger';

@Entity('temperature_metrics')
export class TemperatureMetric extends Metric {
  @ApiProperty({
    description: 'Unit of temperature measurement',
    enum: TemperatureUnit,
    enumName: 'TemperatureUnit',
    example: 'CELSIUS',
  })
  @Column({
    type: 'enum',
    enum: TemperatureUnit,
  })
  unit: TemperatureUnit;

  constructor() {
    super();
    this.type = MetricType.TEMPERATURE;
  }
}
