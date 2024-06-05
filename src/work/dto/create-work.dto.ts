import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { SessionStatus } from '@prisma/client';

export class CreateWorkDto {
  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @IsOptional()
  @IsDateString()
  endTime?: Date;

  @IsOptional()
  @IsDateString()
  breakStartTime?: Date;

  @IsOptional()
  @IsDateString()
  breakEndTime?: Date;

  @IsOptional()
  duration?: number;

  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;

  @IsOptional()
  @IsString()
  description?: string;
}
