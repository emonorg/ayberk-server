import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ABACService } from 'src/lib/abac/abac.service';
import { Operator, OperatorDocument } from 'src/operator/models/operator.model';
import { PrivilegeDomain } from 'src/privilege/models/privilege.model';
import { ProjectService } from 'src/project/project.service';
import { CreateEnvDto } from './dtos/createEnv.dto';
import { PatchEnvDto } from './dtos/patchEnv.dto';
import { Environment, EnvironmentDocument } from './models/environment.model';

@Injectable()
export class EnvironmentService extends ABACService<EnvironmentDocument> {
  constructor(
    @InjectModel(Environment.name)
    private envModel: Model<EnvironmentDocument>,
    @Inject(forwardRef(() => ProjectService))
    private projectService: ProjectService,
  ) {
    super(PrivilegeDomain.ENVS, envModel);
  }

  async internal_getEnvs(
    id?: string,
  ): Promise<EnvironmentDocument[] | EnvironmentDocument> {
    const envs = await this.envModel
      .find(id ? { _id: id } : undefined)
      .populate({
        path: 'projects',
        select: '_id name',
      })
      .exec();
    return id ? envs[0] : envs;
  }

  async createEnv(
    operator: OperatorDocument,
    dto: CreateEnvDto,
  ): Promise<EnvironmentDocument> {
    const createdEnv = await this.envModel.create(dto);
    await this.privilegeService.createPrivilege(
      operator.id,
      PrivilegeDomain.ENVS,
      {
        create: true,
        read: true,
        delete: true,
        update: true,
        manage: true,
      },
      createdEnv.id,
    );
    return createdEnv;
  }

  async getEnvs(
    operator: Operator,
    id?: string,
  ): Promise<EnvironmentDocument[] | EnvironmentDocument> {
    const envs = await super.find(operator, id ? { _id: id } : undefined, {
      path: 'projects',
      select: '_id name',
    });
    return id ? envs[0] : envs;
  }

  async patchEnv(
    operator: Operator,
    id: string,
    dto: PatchEnvDto,
  ): Promise<EnvironmentDocument> {
    return await super.findOneAndUpdate(operator, { _id: id }, { ...dto });
  }

  async deleteEnv(
    operator: Operator,
    id: string,
  ): Promise<EnvironmentDocument> {
    const deletedEnv = await super.findOneAndDelete(operator, { _id: id });
    if (!deletedEnv)
      throw new HttpException(
        'Invalid environment id!',
        HttpStatus.BAD_REQUEST,
      );
    // Delete related projects
    await this.projectService.internal_deleteEnvProjects(deletedEnv.id);
    return deletedEnv;
  }
}
