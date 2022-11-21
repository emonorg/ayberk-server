import { createHmac } from 'crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOperatorDto } from './dtos/createOperator.dto';
import { Operator, OperatorDocument } from './models/operator.model';
import {
  PrivilegeDocument,
  PrivilegeDomain,
} from '../privilege/models/privilege.model';
import { GrantPrivilegeDto } from './dtos/grantPrivilege.dto';
import { ABACService } from 'src/lib/abac/abac.service';

@Injectable()
export class OperatorService extends ABACService<OperatorDocument> {
  constructor(
    private configService: ConfigService,
    @InjectModel(Operator.name) private operatorModel: Model<OperatorDocument>,
  ) {
    super(PrivilegeDomain.OPERATORS, operatorModel);
  }

  async internal_getOperatorByUsername(
    username: string,
  ): Promise<OperatorDocument> {
    const _operator = await this.operatorModel
      .findOne({ username, isActive: true })
      .populate({ path: 'privileges', select: 'domain actions -_id' })
      .exec();
    if (!_operator) throw Error('Invalid username');
    return _operator;
  }

  async createRootOperator(): Promise<OperatorDocument> {
    const rootOperator = await this.createOperator({
      username: this.configService.get<string>('service.root_username'),
      password: this.configService.get<string>('service.root_password'),
      name: 'root',
    });

    await this.privilegeService.createPrivilege(
      rootOperator,
      PrivilegeDomain.ALL,
      {
        manage: true,
      },
    );

    return rootOperator;
  }

  async getOperators(
    operator: Operator,
    id?: string,
  ): Promise<OperatorDocument[] | OperatorDocument> {
    const operators = await super.find(
      operator,
      id ? { _id: id } : undefined,
      'privileges',
      '-passwordHash',
    );
    return id ? operators[0] : operators;
  }

  async createOperator(dto: CreateOperatorDto): Promise<OperatorDocument> {
    const newOperator = await this.operatorModel.create({
      ...dto,
      passwordHash: await createHmac(
        'sha256',
        this.configService.get('encryption.secret'),
      )
        .update(dto.password)
        .digest('hex'),
    });
    newOperator.passwordHash = undefined; // TODO: Use Exclude decorator to exclude this field
    return newOperator;
  }

  async getOperatorByUsername(
    operator: Operator,
    username: string,
  ): Promise<OperatorDocument> {
    const _operator = await super.findOne(
      operator,
      { username, isActive: true },
      { path: 'privileges', select: 'domain actions -_id' },
    );
    if (!_operator) throw Error('Invalid username');
    return _operator;
  }

  async grantPrivilege(dto: GrantPrivilegeDto): Promise<PrivilegeDocument> {
    const operator = await this.operatorModel.findOne({ _id: dto.operatorId });
    if (!operator) throw new BadRequestException('OperatorId is not valid!');
    const privilege = await this.privilegeService.createPrivilege(
      operator,
      dto.domain,
      dto.actions,
      dto.entityId,
    );
    return privilege;
  }
}
