import { IsEnum, IsNotEmpty } from 'class-validator';
import { CreateMetricDto } from './create-metric.dto';
import { DistanceUnit, MetricType } from '../../common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDistanceMetricDto extends CreateMetricDto {
  @ApiProperty({
    description: 'Unit of distance measurement',
    enum: DistanceUnit,
    enumName: 'DistanceUnit',
    example: 'METER',
  })
  @IsNotEmpty()
  @IsEnum(DistanceUnit)
  unit: DistanceUnit;

  @ApiProperty({
    description: 'Type of the metric (always DISTANCE for this endpoint)',
    enum: MetricType,
    enumName: 'MetricType',
    example: 'DISTANCE',
  })
  type: MetricType;

  constructor() {
    super();
    this.type = MetricType.DISTANCE;
  }
}
