import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Operator, OperatorDocument } from 'src/operator/models/operator.model';
import { OperatorService } from 'src/operator/operator.service';
import {
  Action,
  IActions,
  Privilege,
  PrivilegeDocument,
  PrivilegeDomain,
} from 'src/privilege/models/privilege.model';

@Injectable()
export class PrivilegeService {
  constructor(
    @InjectModel(Privilege.name)
    private privilegeModel: Model<PrivilegeDocument>,
    @InjectModel(Operator.name)
    private operatorModel: Model<OperatorDocument>,
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
