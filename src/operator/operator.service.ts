import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Operator, OperatorDocument } from './models/operator.model';
import { Privilege, PrivilegeDocument } from './models/privilege.model';

@Injectable()
export class OperatorService {
  constructor(
    private configService: ConfigService,
    @InjectModel(Operator.name) private operatorModel: Model<OperatorDocument>,
    @InjectModel(Privilege.name)
    private privilegeModel: Model<PrivilegeDocument>,
  ) {}

  async setup_createRootOperator(): Promise<OperatorDocument> {
    const privilege = await this.privilegeModel.create({
      domain: 'all',
      actions: {
        write: true,
        read: true,
        update: true,
        delete: true,
      },
    });

    const rootOperator = await this.operatorModel.create({
      username: this.configService.get<string>('service.root_username'),
      encryptedPassword: this.configService.get<string>(
        'service.root_password',
      ),
      name: 'root',
      privileges: [privilege],
    });

    return rootOperator;
  }
}
