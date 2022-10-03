import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Operator, OperatorSchema } from 'src/operator/models/operator.model';
import {
  Privilege,
  PrivilegeSchema,
} from 'src/privilege/models/privilege.model';
import { PrivilegeService } from './privilege.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Privilege.name,
        schema: PrivilegeSchema,
      },
      {
        name: Operator.name,
        schema: OperatorSchema,
      },
    ]),
  ],
  providers: [PrivilegeService],
  exports: [PrivilegeService],
})
export class PrivilegeModule {}
