import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectService } from 'src/project/project.service';
import { CreateVariableDto } from './dtos/createVariable.dto';
import { PatchVariableByIdDto } from './dtos/patchVariableById.dto';
import { UpdateVariableByKeyDto } from './dtos/updateVariable.dto';
import {
  Variable,
  VariableDocument,
  VariableValueType,
} from './models/variable.model';

@Injectable()
export class VariableService {
  constructor(
    @InjectModel(Variable.name) private variableModel: Model<VariableDocument>,
    private projectService: ProjectService,
  ) {}

  async createVariable(dto: CreateVariableDto): Promise<VariableDocument> {
    const project = await this.projectService.getProjects(dto.projectId);
    return await this.variableModel.create({
      project,
      key: dto.key,
      value: dto.value,
    });
  }

  async getVariableValueByKey(
    projectId: string,
    key: string,
  ): Promise<VariableValueType> {
    const project = await this.projectService.getProjects(projectId);
    return await await this.variableModel
      .findOne({ key, project })
      .select('value');
  }

  async patchVariableById(
    id: string,
    dto: PatchVariableByIdDto,
  ): Promise<VariableDocument> {
    return await this.variableModel.findOneAndUpdate({ _id: id }, dto, {
      new: true,
    });
  }

  async updateVariableByKey(
    dto: UpdateVariableByKeyDto,
  ): Promise<VariableValueType> {
    const project = await this.projectService.getProjects(dto.projectId);
    return await this.variableModel
      .findOneAndUpdate(
        { key: dto.key, project },
        { value: dto.value },
        { new: true },
      )
      .select('value');
  }

  async getProjectVariables(projectId: string): Promise<VariableDocument[]> {
    const project = await this.projectService.getProjects(projectId);
    return await this.variableModel.find({ project }).select('key value');
  }

  async deleteVariableById(id: string): Promise<VariableDocument> {
    return await this.variableModel.findOneAndDelete({ _id: id });
  }
}
