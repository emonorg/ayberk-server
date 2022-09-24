import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateOperatorDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  name: string;
}
