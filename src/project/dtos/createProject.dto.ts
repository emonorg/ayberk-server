import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty()
  @IsMongoId()
  envId: string;

  @ApiProperty()
  @IsString()
  name: string;
}
