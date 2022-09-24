import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectDocument } from 'src/project/models/project.model';
import { ProjectService } from 'src/project/project.service';
import { CreateEnvDto } from './dtos/createEnv.dto';
import { PatchEnvDto } from './dtos/patchEnv.dto';
import { Environment, EnvironmentDocument } from './models/environment.model';

@Injectable()
export class EnvironmentService {
  constructor(
    @InjectModel(Environment.name) private envModel: Model<EnvironmentDocument>,
    @Inject(forwardRef(() => ProjectService))
    private projectService: ProjectService,
  ) {}

  async createEnv(dto: CreateEnvDto): Promise<EnvironmentDocument> {
    return await this.envModel.create(dto);
  }

  async getEnvs(
    id?: string,
  ): Promise<EnvironmentDocument[] | EnvironmentDocument> {
    const envs = await this.envModel
      .find(id ? { _id: id } : undefined)
      .populate('projects', '_id name')
      .exec();
    return id ? envs[0] : envs;
  }

  async patchEnv(id: string, dto: PatchEnvDto): Promise<EnvironmentDocument> {
    return await this.envModel.findOneAndUpdate(
      { id },
      { ...dto },
      { new: true },
    );
  }

  async deleteEnv(id: string): Promise<EnvironmentDocument> {
    const deletedEnv = await this.envModel.findOneAndDelete({ id });
    if (!deletedEnv)
      throw new HttpException(
        'Invalid environment id!',
        HttpStatus.BAD_REQUEST,
      );
    // Delete related projects
    await this.projectService.deleteEnvProjects(deletedEnv.id);
    return deletedEnv;
  }

  async addProjectToEnv(
    envId: string,
    project: ProjectDocument,
  ): Promise<void> {
    await this.envModel.updateOne(
      { id: envId },
      { $push: { projects: project } },
    );
  }
}
