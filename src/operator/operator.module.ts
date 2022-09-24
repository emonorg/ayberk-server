import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Operator, OperatorSchema } from './models/operator.model';
import { Privilege, PrivilegeSchema } from './models/privilege.model';
import { OperatorService } from './operator.service';
import { OperatorController } from './operator.controller';

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
  controllers: [OperatorController],
})
export class OperatorModule {}
