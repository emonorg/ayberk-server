import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PatchVariableByIdDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  key: string;

  @ApiProperty()
  @IsOptional()
  value: string;
}
