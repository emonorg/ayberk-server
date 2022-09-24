import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MongoIdPipe } from 'src/validators/pipes/mongoId.pipe';
import { CreateProjectDto } from './dtos/createProject.dto';
import { Project, ProjectDocument } from './models/project.model';
import { ProjectService } from './project.service';

@Controller('project')
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
}
