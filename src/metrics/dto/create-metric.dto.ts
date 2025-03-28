import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { MetricType } from '../../common/enums';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMetricDto {
  @ApiProperty({
    description: 'User ID for grouping metrics',
    example: 'user123',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Date when the metric was recorded',
    example: '2023-10-15T14:30:00Z',
    type: Date,
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({
    description: 'Numeric value of the metric',
    example: 5.5,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @ApiProperty({
    description: 'Type of the metric (DISTANCE or TEMPERATURE)',
    enum: MetricType,
    enumName: 'MetricType',
    example: 'DISTANCE',
  })
  @IsNotEmpty()
  @IsEnum(MetricType)
  type: MetricType;
}
