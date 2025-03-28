import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DistanceUnit, MetricType, TemperatureUnit } from '../../common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class GetMetricsDto {
  @ApiProperty({
    description: 'User ID to get metrics for',
    example: 'user123',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Type of the metric (DISTANCE or TEMPERATURE)',
    enum: MetricType,
    enumName: 'MetricType',
    example: 'DISTANCE',
  })
  @IsNotEmpty()
  @IsEnum(MetricType)
  type: MetricType;

  @ApiProperty({
    description: 'Target unit for distance metrics (for value conversion)',
    enum: DistanceUnit,
    enumName: 'DistanceUnit',
    example: 'METER',
    required: false,
  })
  @IsOptional()
  @IsEnum(DistanceUnit, {
    message: 'For distance metrics, unit must be a valid DistanceUnit',
  })
  distanceUnit?: DistanceUnit;

  @ApiProperty({
    description: 'Target unit for temperature metrics (for value conversion)',
    enum: TemperatureUnit,
    enumName: 'TemperatureUnit',
    example: 'CELSIUS',
    required: false,
  })
  @IsOptional()
  @IsEnum(TemperatureUnit, {
    message: 'For temperature metrics, unit must be a valid TemperatureUnit',
  })
  temperatureUnit?: TemperatureUnit;
}
