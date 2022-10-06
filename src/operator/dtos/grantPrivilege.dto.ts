import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsObject,
  IsEnum,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';
import {
  IActions,
  PrivilegeDomain,
} from '../../privilege/models/privilege.model';

export class GrantPrivilegeDto {
  @ApiProperty()
  @IsMongoId()
  operatorId: string;

  @ApiProperty()
  @IsEnum(PrivilegeDomain, {
    message: `domain should be one of ${Object.values(PrivilegeDomain)}`,
  })
  domain: PrivilegeDomain;

  @ValidateIf((o) => !o.actions.create)
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  entityId: string;

  @ApiProperty()
  @IsObject()
  actions: IActions;
}
