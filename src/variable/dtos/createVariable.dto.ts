import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VariableValueType } from '../models/variable.model';

export class CreateVariableDto {
  @ApiProperty()
  @IsMongoId()
  projectId: string;

  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsNotEmpty()
  value: VariableValueType;
}
