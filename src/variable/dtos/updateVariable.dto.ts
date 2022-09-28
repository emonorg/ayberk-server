import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class UpdateVariableByKeyDto {
  @ApiProperty()
  @IsMongoId()
  projectId: string;

  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsNotEmpty()
  value: string;
}
