import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { IsAuthorized } from 'src/auth/decorators/isAuthorized.decorator';
import { MongoIdPipe } from 'src/lib/validators/pipes/mongoId.pipe';
import { Action, PrivilegeDomain } from 'src/operator/models/privilege.model';
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
  async createEnv(@Body() dto: CreateEnvDto): Promise<EnvironmentDocument> {
    return await this.envService.createEnv(dto);
  }

  @Get()
  @IsAuthorized({
    domain: PrivilegeDomain.ENVS,
    action: Action.READ,
  })
  async getEnvs(): Promise<EnvironmentDocument[] | EnvironmentDocument> {
    return await this.envService.getEnvs();
  }

  @Get('/:id')
  @IsAuthorized({
    domain: PrivilegeDomain.ENVS,
    action: Action.READ,
  })
  async getEnv(
    @Param('id', MongoIdPipe) id: string,
  ): Promise<EnvironmentDocument[] | EnvironmentDocument> {
    return await this.envService.getEnvs(id);
  }

  @Patch('/:id')
  @IsAuthorized({
    domain: PrivilegeDomain.ENVS,
    action: Action.UPDATE,
  })
  async patchEnv(
    @Param('id', MongoIdPipe) id: string,
    @Body() dto: PatchEnvDto,
  ): Promise<EnvironmentDocument> {
    return await this.envService.patchEnv(id, dto);
  }

  @Delete('/:id')
  @IsAuthorized({
    domain: PrivilegeDomain.ENVS,
    action: Action.DELETE,
  })
  async deleteEnv(
    @Param('id', MongoIdPipe) id: string,
  ): Promise<EnvironmentDocument> {
    return await this.envService.deleteEnv(id);
  }
}
