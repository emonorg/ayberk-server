import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EnvironmentDocument } from 'src/environment/models/environment.model';
import { ABACService } from 'src/lib/abac/abac.service';
import { Operator, OperatorDocument } from 'src/operator/models/operator.model';
import { PrivilegeDomain } from 'src/privilege/models/privilege.model';
import { ProjectDocument } from 'src/project/models/project.model';
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
export class VariableService extends ABACService<VariableDocument> {
  constructor(
    @InjectModel(Variable.name) private variableModel: Model<VariableDocument>,
    @Inject(forwardRef(() => ProjectService))
    private projectService: ProjectService,
  ) {
    super(PrivilegeDomain.VARIABLES, variableModel);
  }

  async internal_deleteProjectVariables(
    project: ProjectDocument,
  ): Promise<void> {
    await this.variableModel.deleteMany({ project });
  }

  async createVariable(
    operator: OperatorDocument,
    dto: CreateVariableDto,
  ): Promise<VariableDocument> {
    const project = await this.projectService.internal_getProjects(
      dto.projectId,
    );

    const createdVariable = await super.create(
      operator,
      {
        project,
        key: dto.key,
        value: dto.value,
      },
      new CreateVariableDto(),
    );
    await this.privilegeService.createPrivilege(
      operator.id,
      PrivilegeDomain.VARIABLES,
      {
        create: true,
        read: true,
        delete: true,
        update: true,
        manage: true,
      },
      createdVariable.id,
    );
    return createdVariable;
  }

  async getVariableValueByKey(
    operator: Operator,
    projectId: string,
    key: string,
  ): Promise<VariableValueType> {
    const project = await this.projectService.internal_getProjects(projectId);
    return await await super.findOne(
      operator,
      { key, project },
      undefined,
      'value',
    );
  }

  async patchVariableById(
    operator: Operator,
    id: string,
    dto: PatchVariableByIdDto,
  ): Promise<VariableDocument> {
    return await super.findOneAndUpdate(operator, { _id: id }, dto);
  }

  async updateVariableByKey(
    operator: Operator,
    dto: UpdateVariableByKeyDto,
  ): Promise<VariableValueType> {
    const project = await this.projectService.internal_getProjects(
      dto.projectId,
    );
    return super.findOneAndUpdate(
      operator,
      { key: dto.key, project },
      { value: dto.value },
      undefined,
      'key value',
    );
  }

  async getProjectVariables(
    operator: Operator,
    projectId: string,
  ): Promise<VariableDocument[]> {
    const project = await this.projectService.internal_getProjects(projectId);
    return await super.find(operator, { project }, undefined, 'key value');
  }

  async deleteVariableById(
    operator: Operator,
    id: string,
  ): Promise<VariableDocument> {
    return await super.findOneAndDelete(operator, { _id: id });
  }
}
