import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MongoIdPipe } from 'src/lib/validators/pipes/mongoId.pipe';
import { CreateProjectDto } from './dtos/createProject.dto';
import { PatchProjectDto } from './dtos/patchProject.dto';
import { Project, ProjectDocument } from './models/project.model';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post()
  async createProject(@Body() dto: CreateProjectDto): Promise<ProjectDocument> {
    return await this.projectService.createProject(dto);
  }

  @Get()
  async getProjects(): Promise<ProjectDocument[] | Project> {
    return await this.projectService.getProjects();
  }

  @Get('/:id')
  async getProject(
    @Param('id', MongoIdPipe) id: string,
  ): Promise<ProjectDocument[] | Project> {
    return await this.projectService.getProjects(id);
  }

  @Patch('/:id')
  async patchProject(
    @Param('id', MongoIdPipe) id: string,
    @Body() dto: PatchProjectDto,
  ): Promise<ProjectDocument> {
    return await this.projectService.patchProject(id, dto);
  }

  @Delete('/:id')
  async deleteProject(
    @Param(':id', MongoIdPipe) id: string,
  ): Promise<ProjectDocument> {
    return await this.projectService.deleteProject(id);
  }
}
