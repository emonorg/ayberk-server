import * as Bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOperatorDto } from './dtos/createOperator.dto';
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

  async createRootOperator(): Promise<OperatorDocument> {
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
}
