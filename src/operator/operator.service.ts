import * as Bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOperatorDto } from './dtos/createOperator.dto';
import { Operator, OperatorDocument } from './models/operator.model';
import {
  IActions,
  Privilege,
  PrivilegeDocument,
  PrivilegeDomains,
} from './models/privilege.model';

@Injectable()
export class OperatorService {
  constructor(
    private configService: ConfigService,
    @InjectModel(Operator.name) private operatorModel: Model<OperatorDocument>,
    @InjectModel(Privilege.name)
    private privilegeModel: Model<PrivilegeDocument>,
  ) {}

  async createPrivilege(
    domain: PrivilegeDomains,
    actions: IActions,
  ): Promise<PrivilegeDocument> {
    return await this.privilegeModel.create({
      domain: domain,
      actions: actions,
    });
  }

  async createRootOperator(): Promise<OperatorDocument> {
    const privilege = await this.createPrivilege(PrivilegeDomains.ALL, {
      manage: true,
    });

    const rootOperator = await this.createOperator(
      {
        username: this.configService.get<string>('service.root_username'),
        password: this.configService.get<string>('service.root_password'),
        name: 'root',
      },
      privilege,
    );

    return rootOperator;
  }

  async getOperators(
    id?: string,
  ): Promise<OperatorDocument[] | OperatorDocument> {
    const operators = await this.operatorModel
      .find(id ? { _id: id } : undefined, '-encryptedPassword') // TODO: Use Exclude decorator to exclude this field
      .populate('privileges')
      .exec();
    return id ? operators[0] : operators;
  }

  async createOperator(
    dto: CreateOperatorDto,
    privilege?: PrivilegeDocument,
  ): Promise<OperatorDocument> {
    const newOperator = await this.operatorModel.create({
      ...dto,
      encryptedPassword: await Bcrypt.hash(dto.password, 10),
      privileges: [privilege ? privilege : undefined],
    });
    newOperator.encryptedPassword = undefined; // TODO: Use Exclude decorator to exclude this field
    return newOperator;
  }
}
