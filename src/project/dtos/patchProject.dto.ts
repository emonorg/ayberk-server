import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class PatchProjectDto {
  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  envId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;
}
