import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Operator, OperatorSchema } from './models/operator.model';
import { Privilege, PrivilegeSchema } from './models/privilege.model';
import { OperatorService } from './operator.service';

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
  ],
  providers: [OperatorService],
  exports: [OperatorService],
})
export class OperatorModule {}
