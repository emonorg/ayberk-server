import { IEntityData } from 'src/project/dtos/createProject.dto';

export interface ICreateDto {
  getParentEntityData(): IEntityData;
}
