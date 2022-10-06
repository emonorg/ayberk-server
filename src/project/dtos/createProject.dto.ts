import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import { ICreateDto } from 'src/lib/dto/create.dto';
import { PrivilegeDomain } from 'src/privilege/models/privilege.model';

export interface IEntityData {
  domain: PrivilegeDomain;
  parentKeyInChild: string;
}

export class CreateProjectDto implements ICreateDto {
  getParentEntityData(): IEntityData {
    return {
      domain: PrivilegeDomain.ENVS,
      parentKeyInChild: 'envId',
    };
  }

  @ApiProperty()
  @IsMongoId()
  envId: string;

  @ApiProperty()
  @IsString()
  name: string;
}
