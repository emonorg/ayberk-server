import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsObject, IsString } from 'class-validator';
import { IActions, PrivilegeDomain } from '../models/privilege.model';

export class GrantPrivilegeDto {
  @ApiProperty()
  @IsMongoId()
  operatorId: string;

  @ApiProperty()
  @IsString()
  domain: PrivilegeDomain;

  @ApiProperty()
  @IsObject()
  actions: IActions;
}
