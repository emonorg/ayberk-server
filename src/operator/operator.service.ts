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
  PrivilegeDomain,
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
    operator: OperatorDocument,
    domain: PrivilegeDomain,
    actions: IActions,
  ): Promise<PrivilegeDocument> {
    const privilege = await this.privilegeModel.create({
      operator: operator,
      domain: domain,
      actions: actions,
    });

    await this.operatorModel.updateOne(
      { operator },
      { $push: { privileges: privilege } },
    );

    return privilege;
  }

  async createRootOperator(): Promise<OperatorDocument> {
    const rootOperator = await this.createOperator({
      username: this.configService.get<string>('service.root_username'),
      password: this.configService.get<string>('service.root_password'),
      name: 'root',
    });

    await this.createPrivilege(rootOperator, PrivilegeDomain.ALL, {
      manage: true,
    });

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

  async createOperator(dto: CreateOperatorDto): Promise<OperatorDocument> {
    const newOperator = await this.operatorModel.create({
      ...dto,
      encryptedPassword: await Bcrypt.hash(dto.password, 10),
    });
    newOperator.encryptedPassword = undefined; // TODO: Use Exclude decorator to exclude this field
    return newOperator;
  }

  async getOperatorByUsername(username: string): Promise<OperatorDocument> {
    const operator = await this.operatorModel
      .findOne({ username, isActive: true })
      .populate('privileges', 'domain actions -_id')
      .exec();
    if (!operator) throw Error('Invalid username');
    return operator;
  }
}
