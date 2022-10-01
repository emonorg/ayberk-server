import * as Bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOperatorDto } from './dtos/createOperator.dto';
import { Operator, OperatorDocument } from './models/operator.model';
import {
  Action,
  IActions,
  Privilege,
  PrivilegeDocument,
  PrivilegeDomain,
} from './models/privilege.model';
import { GrantPrivilegeDto } from './dtos/grantPrivilege.dto';

@Injectable()
export class OperatorService {
  constructor(
    private configService: ConfigService,
    @InjectModel(Operator.name) private operatorModel: Model<OperatorDocument>,
    @InjectModel(Privilege.name)
    private privilegeModel: Model<PrivilegeDocument>,
  ) {}

  // TODO: Use transaction session for this process
  async createPrivilege(
    operator: OperatorDocument,
    domain: PrivilegeDomain,
    actions: IActions,
    entityId?: string,
  ): Promise<PrivilegeDocument> {
    const existingPrivilege = await this.privilegeModel.findOne({
      operator,
      domain,
      entityId: entityId ? entityId : null,
    });

    // TODO: Check if entityId is valid
    if (existingPrivilege) {
      return this.privilegeModel
        .findOneAndUpdate(
          entityId ? { operator, domain, entityId } : { operator, domain },
          { actions },
          { new: true },
        )
        .select('-operator');
    }

    const privilege = await this.privilegeModel.create({
      operator,
      domain,
      entityId: entityId ? entityId : null,
      actions,
    });

    privilege.operator = undefined;

    await this.operatorModel.updateOne(
      { _id: operator.id },
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

  async grantPrivilege(dto: GrantPrivilegeDto): Promise<PrivilegeDocument> {
    const operator = await this.operatorModel.findOne({ _id: dto.operatorId });
    if (!operator) throw new BadRequestException('OperatorId is not valid!');
    const privilege = await this.createPrivilege(
      operator,
      dto.domain,
      dto.actions,
      dto.entityId,
    );
    return privilege;
  }

  async getGrantedEntitiesIds(
    domain: PrivilegeDomain,
    operator: Operator,
    action: Action,
  ): Promise<unknown[]> {
    const grantedEntities = await this.privilegeModel
      .find({ operator, domain, [`actions.${action}`]: true })
      .distinct('entityId');
    return grantedEntities.map((p) => p?.toString());
  }

  async isEntityGranted(
    domain: PrivilegeDomain,
    operator: Operator,
    entityId: string,
    action: Action,
  ): Promise<boolean> {
    if (await this.hasManagePrivilege(operator, domain)) return true;
    const grantedEntity = await this.privilegeModel.findOne({
      operator,
      domain,
      entityId: entityId,
      [`actions.${action}`]: true,
    });
    if (grantedEntity) return true;
    return false;
  }

  async hasManagePrivilege(operator: Operator, domain: PrivilegeDomain) {
    const privilege = await this.privilegeModel.findOne({
      operator,
      $or: [{ domain }, { domain: PrivilegeDomain.ALL }],
      'actions.manage': true,
    });
    if (privilege) return true;
    return false;
  }
}
