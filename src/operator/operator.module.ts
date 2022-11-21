import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Operator, OperatorSchema } from './models/operator.model';
import {
  Privilege,
  PrivilegeSchema,
} from '../privilege/models/privilege.model';
import { OperatorService } from './operator.service';
import { OperatorController } from './operator.controller';
import { PrivilegeModule } from 'src/privilege/privilege.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Operator.name,
        schema: OperatorSchema,
      },
      {
        name: Privilege.name,
        schema: PrivilegeSchema,
      },
    ]),
    PrivilegeModule,
  ],
  providers: [OperatorService],
  exports: [OperatorService],
  controllers: [OperatorController],
})
export class OperatorModule {}
