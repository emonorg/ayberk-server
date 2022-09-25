import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MongoIdPipe } from 'src/validators/pipes/mongoId.pipe';
import { CreateEnvDto } from './dtos/createEnv.dto';
import { PatchEnvDto } from './dtos/patchEnv.dto';
import { EnvironmentService } from './environment.service';
import { EnvironmentDocument } from './models/environment.model';

@Controller('envs')
export class EnvironmentController {
  constructor(private envService: EnvironmentService) {}

  @Post()
  async createEnv(@Body() dto: CreateEnvDto): Promise<EnvironmentDocument> {
    return await this.envService.createEnv(dto);
  }

  @Get()
  async getEnvs(): Promise<EnvironmentDocument[] | EnvironmentDocument> {
    return await this.envService.getEnvs();
  }

  @Get('/:id')
  async getEnv(
    @Param('id', MongoIdPipe) id: string,
  ): Promise<EnvironmentDocument[] | EnvironmentDocument> {
    return await this.envService.getEnvs(id);
  }

  @Patch('/:id')
  async patchEnv(
    @Param('id', MongoIdPipe) id: string,
    @Body() dto: PatchEnvDto,
  ): Promise<EnvironmentDocument> {
    return await this.envService.patchEnv(id, dto);
  }

  @Delete('/:id')
  async deleteEnv(
    @Param('id', MongoIdPipe) id: string,
  ): Promise<EnvironmentDocument> {
    return await this.envService.deleteEnv(id);
  }
}
