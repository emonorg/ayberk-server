import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { IsAuthorized } from 'src/auth/decorators/isAuthorized.decorator';
import { AuthenticatedRequest } from 'src/lib/interfaces/authenticatedRequest.interface';
import { MongoIdPipe } from 'src/lib/validators/pipes/mongoId.pipe';
import { Operator, OperatorDocument } from 'src/operator/models/operator.model';
import { Action, PrivilegeDomain } from 'src/privilege/models/privilege.model';
import { CreateEnvDto } from './dtos/createEnv.dto';
import { PatchEnvDto } from './dtos/patchEnv.dto';
import { EnvironmentService } from './environment.service';
import { EnvironmentDocument } from './models/environment.model';

@Controller('envs')
export class EnvironmentController {
  constructor(private envService: EnvironmentService) {}

  @Post()
  @IsAuthorized({
    domain: PrivilegeDomain.ENVS,
    action: Action.CREATE,
  })
  async createEnv(
    @Req() req: AuthenticatedRequest<OperatorDocument>,
    @Body() dto: CreateEnvDto,
  ): Promise<EnvironmentDocument> {
    return await this.envService.createEnv(req.principle, dto);
  }

  @Get()
  @IsAuthorized({
    domain: PrivilegeDomain.ENVS,
    action: Action.READ,
  })
  async getEnvs(
    @Req() req: AuthenticatedRequest<Operator>,
  ): Promise<EnvironmentDocument[] | EnvironmentDocument> {
    return await this.envService.getEnvs(req.principle);
  }

  @Get('/:id')
  @IsAuthorized({
    domain: PrivilegeDomain.ENVS,
    action: Action.READ,
  })
  async getEnv(
    @Param('id', MongoIdPipe) id: string,
    @Req() req: AuthenticatedRequest<Operator>,
  ): Promise<EnvironmentDocument[] | EnvironmentDocument> {
    return await this.envService.getEnvs(req.principle, id);
  }

  @Patch('/:id')
  @IsAuthorized({
    domain: PrivilegeDomain.ENVS,
    action: Action.UPDATE,
  })
  async patchEnv(
    @Param('id', MongoIdPipe) id: string,
    @Body() dto: PatchEnvDto,
    @Req() req: AuthenticatedRequest<Operator>,
  ): Promise<EnvironmentDocument> {
    return await this.envService.patchEnv(req.principle, id, dto);
  }

  @Delete('/:id')
  @IsAuthorized({
    domain: PrivilegeDomain.ENVS,
    action: Action.DELETE,
  })
  async deleteEnv(
    @Param('id', MongoIdPipe) id: string,
    @Req() req: AuthenticatedRequest<Operator>,
  ): Promise<EnvironmentDocument> {
    return await this.envService.deleteEnv(req.principle, id);
  }
}
