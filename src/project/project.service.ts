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
import { CreateProjectDto } from './dtos/createProject.dto';
import { PatchProjectDto } from './dtos/patchProject.dto';
import { Project, ProjectDocument } from './models/project.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @Inject(forwardRef(() => EnvironmentService))
    private envService: EnvironmentService,
  ) {}

  async createProject(dto: CreateProjectDto): Promise<ProjectDocument> {
    const env = await this.envService.getEnvs(dto.envId);
    if (!env) throw new NotFoundException('Env not found!');
    const newProject = await this.projectModel.create({
      ...dto,
      environment: dto.envId,
    });
    await this.envService.addProjectToEnv(dto.envId, newProject);
    return newProject;
  }

  async getProjects(id?: string): Promise<ProjectDocument[] | ProjectDocument> {
    const projects = await this.projectModel
      .find(id ? { _id: id } : undefined)
      .populate({
        path: 'environment',
        select: '_id name',
      })
      .exec();
    return id ? projects[0] : projects;
  }

  async patchProject(
    id: string,
    dto: PatchProjectDto,
  ): Promise<ProjectDocument> {
    return await this.projectModel.findOneAndUpdate(
      { id },
      { ...dto },
      { new: true },
    );
  }

  async deleteProject(id: string): Promise<ProjectDocument> {
    const deletedProject = await this.projectModel.findOneAndDelete({ id });
    if (!deletedProject)
      throw new HttpException('Invalid project id!', HttpStatus.BAD_REQUEST);
    return deletedProject;
  }

  async deleteEnvProjects(id: string): Promise<void> {
    await this.projectModel.deleteMany({ environment: id });
  }
}
