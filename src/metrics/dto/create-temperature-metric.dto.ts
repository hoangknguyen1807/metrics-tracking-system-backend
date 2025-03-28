import { IsEnum, IsNotEmpty } from 'class-validator';
import { CreateMetricDto } from './create-metric.dto';
import { MetricType, TemperatureUnit } from '../../common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTemperatureMetricDto extends CreateMetricDto {
  @ApiProperty({
    description: 'Unit of temperature measurement',
    enum: TemperatureUnit,
    enumName: 'TemperatureUnit',
    example: 'CELSIUS',
  })
  @IsNotEmpty()
  @IsEnum(TemperatureUnit)
  unit: TemperatureUnit;

  @ApiProperty({
    description: 'Type of the metric (always TEMPERATURE for this endpoint)',
    enum: MetricType,
    enumName: 'MetricType',
    example: 'TEMPERATURE',
  })
  type: MetricType;

  constructor() {
    super();
    this.type = MetricType.TEMPERATURE;
  }
}
