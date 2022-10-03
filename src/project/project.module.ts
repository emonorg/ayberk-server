import { forwardRef, Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './models/project.model';
import { EnvironmentModule } from 'src/environment/environment.module';
import { OperatorModule } from 'src/operator/operator.module';
import { PrivilegeModule } from 'src/privilege/privilege.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Project.name,
        schema: ProjectSchema,
      },
    ]),
    forwardRef(() => EnvironmentModule),
    OperatorModule,
    PrivilegeModule,
  ],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
