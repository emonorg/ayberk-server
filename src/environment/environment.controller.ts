import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEnvDto } from './dtos/createEnv.dto';
import { PatchEnvDto } from './dtos/patchEnv.dto';
import { EnvironmentService } from './environment.service';
import { Environment, EnvironmentDocument } from './models/environment.model';

@Controller('env')
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
    @Param('id') id: string,
  ): Promise<EnvironmentDocument[] | EnvironmentDocument> {
    return await this.envService.getEnvs(id);
  }

  @Patch('/:id')
  async patchEnv(
    @Param('id') id: string,
    @Body() dto: PatchEnvDto,
  ): Promise<EnvironmentDocument> {
    return await this.envService.patchEnv(id, dto);
  }

  @Delete('/:id')
  async deleteEnv(@Param('id') id: string): Promise<EnvironmentDocument> {
    return await this.envService.deleteEnv(id);
  }
}
