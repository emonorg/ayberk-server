import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsObject, IsEnum } from 'class-validator';
import { IActions, PrivilegeDomain } from '../models/privilege.model';

export class GrantPrivilegeDto {
  @ApiProperty()
  @IsMongoId()
  operatorId: string;

  @ApiProperty()
  @IsEnum(PrivilegeDomain)
  domain: PrivilegeDomain;

  @ApiProperty()
  @IsObject()
  actions: IActions;
}