import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EnvironmentService } from 'src/environment/environment.service';
import { ABACService } from 'src/lib/abac/abac.service';
import { Operator } from 'src/operator/models/operator.model';
import { PrivilegeDomain } from 'src/privilege/models/privilege.model';
import { VariableDocument } from 'src/variable/models/variable.model';
import { VariableService } from 'src/variable/variable.service';
import { CreateProjectDto } from './dtos/createProject.dto';
import { PatchProjectDto } from './dtos/patchProject.dto';
import { Project, ProjectDocument } from './models/project.model';

@Injectable()
export class ProjectService extends ABACService<ProjectDocument> {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @Inject(forwardRef(() => EnvironmentService))
    private envService: EnvironmentService,
    @Inject(forwardRef(() => VariableService))
    private variableService: VariableService,
  ) {
    super(PrivilegeDomain.PROJECTS, projectModel);
  }

  async internal_pullVariableFromProject(
    variable: VariableDocument,
  ): Promise<void> {
    await (
      await variable.populate('project')
    ).updateOne({ $pull: { 'variables._id': variable._id } });
  }

  async internal_getProjects(
    id?: string,
  ): Promise<ProjectDocument[] | ProjectDocument> {
    const projects = await this.projectModel
      .find(id ? { _id: id } : undefined)
      .populate({
        path: 'environment',
        select: '_id name',
      })
      .exec();
    return id ? projects[0] : projects;
  }

  async internal_deleteEnvProjects(id: string): Promise<void> {
    await this.projectModel.deleteMany({ environment: id });
  }

  async createProject(
    operator: Operator,
    dto: CreateProjectDto,
  ): Promise<ProjectDocument> {
    const env = await this.envService.internal_getEnvs(dto.envId);
    if (!env) throw new NotFoundException('Env not found!');
    const newProject = await super.create(
      operator,
      {
        ...dto,
        environment: dto.envId,
      },
      new CreateProjectDto(),
    );
    return newProject;
  }

  async getProjects(
    operator: Operator,
    id?: string,
  ): Promise<ProjectDocument[] | ProjectDocument> {
    const projects = await super.find(operator, id ? { _id: id } : undefined, {
      path: 'environment',
      select: '_id name',
    });
    return id ? projects[0] : projects;
  }

  async patchProject(
    operator: Operator,
    id: string,
    dto: PatchProjectDto,
  ): Promise<ProjectDocument> {
    return await super.findOneAndUpdate(operator, { _id: id }, { ...dto });
  }

  async deleteProject(
    operator: Operator,
    id: string,
  ): Promise<ProjectDocument> {
    const deletedProject = await this.projectModel.findOneAndDelete(operator, {
      id,
    });
    if (!deletedProject)
      throw new HttpException('Invalid project id!', HttpStatus.BAD_REQUEST);

    await this.variableService.internal_deleteProjectVariables(deletedProject);
    return deletedProject;
  }
}
