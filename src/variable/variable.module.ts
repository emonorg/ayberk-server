import { Module } from '@nestjs/common';
import { VariableService } from './variable.service';
import { VariableController } from './variable.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Variable, VariableSchema } from './models/variable.model';
import { ProjectModule } from 'src/project/project.module';
import { PrivilegeModule } from 'src/privilege/privilege.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        schema: VariableSchema,
        name: Variable.name,
      },
    ]),
    ProjectModule,
    PrivilegeModule,
  ],
  providers: [VariableService],
  controllers: [VariableController],
})
export class VariableModule {}
