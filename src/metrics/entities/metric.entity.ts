import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MetricType } from '../../common/enums';
import { ApiProperty } from '@nestjs/swagger';

@Entity('metrics')
export class Metric {
  @ApiProperty({
    description: 'Unique identifier for the metric',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'User ID associated with the metric',
    example: 'user123',
  })
  @Column({ name: 'user_id' })
  userId: string;

  @ApiProperty({
    description: 'Date when the metric was recorded',
    example: '2023-10-15T14:30:00Z',
    type: Date,
  })
  @Column({ type: 'timestamp' })
  date: Date;

  @ApiProperty({
    description: 'Numeric value of the metric',
    example: 5.5,
    type: Number,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @ApiProperty({
    description: 'Type of the metric (DISTANCE or TEMPERATURE)',
    enum: MetricType,
    enumName: 'MetricType',
    example: 'DISTANCE',
  })
  @Column({
    type: 'enum',
    enum: MetricType,
  })
  type: MetricType;

  @ApiProperty({
    description: 'Creation timestamp',
    type: Date,
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    type: Date,
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
