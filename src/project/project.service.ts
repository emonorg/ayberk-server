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
import { CreateProjectDto } from './dtos/createProject.dto';
import { PatchProjectDto } from './dtos/patchProject.dto';
import { Project, ProjectDocument } from './models/project.model';

@Injectable()
export class ProjectService extends ABACService<ProjectDocument> {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @Inject(forwardRef(() => EnvironmentService))
    private envService: EnvironmentService,
  ) {
    super(PrivilegeDomain.PROJECTS, projectModel);
  }

  async internal_deleteEnvProjects(id: string): Promise<void> {
    await this.projectModel.deleteMany({ environment: id });
  }

  async createProject(dto: CreateProjectDto): Promise<ProjectDocument> {
    const env = await this.envService.internal_getEnvs(dto.envId);
    if (!env) throw new NotFoundException('Env not found!');
    const newProject = await this.projectModel.create({
      ...dto,
      environment: dto.envId,
    });
    await this.envService.internal_addProjectToEnv(dto.envId, newProject);
    return newProject;
  }

  async getProjects(
    id?: string,
    operator?: Operator,
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
    return deletedProject;
  }
}
