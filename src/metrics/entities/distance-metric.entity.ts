import { Column, Entity } from 'typeorm';
import { Metric } from './metric.entity';
import { DistanceUnit, MetricType } from '../../common/enums';
import { ApiProperty } from '@nestjs/swagger';

@Entity('distance_metrics')
export class DistanceMetric extends Metric {
  @ApiProperty({
    description: 'Unit of distance measurement',
    enum: DistanceUnit,
    enumName: 'DistanceUnit',
    example: 'METER',
  })
  @Column({
    type: 'enum',
    enum: DistanceUnit,
  })
  unit: DistanceUnit;

  constructor() {
    super();
    this.type = MetricType.DISTANCE;
  }
}
