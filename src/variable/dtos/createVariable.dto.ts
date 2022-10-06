import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ICreateDto } from 'src/lib/dto/create.dto';
import { PrivilegeDomain } from 'src/privilege/models/privilege.model';
import { IEntityData } from 'src/project/dtos/createProject.dto';
import { VariableValueType } from '../models/variable.model';

export class CreateVariableDto implements ICreateDto {
  getParentEntityData(): IEntityData {
    return {
      domain: PrivilegeDomain.PROJECTS,
      parentKeyInChild: 'projectId',
    };
  }

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
