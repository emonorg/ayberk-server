import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Operator } from 'src/operator/models/operator.model';
import { Action, PrivilegeDomain } from 'src/privilege/models/privilege.model';
import { PrivilegeService } from 'src/privilege/privilege.service';

@Injectable()
export abstract class ABACService<T> {
  @Inject() public privilegeService: PrivilegeService;
  constructor(private domain: PrivilegeDomain, readonly model: Model<T>) {}

  async getEntityId(filterOpts) {
    let entityId = null;
    if (!filterOpts.id)
      entityId = await (await this.model.findOne(filterOpts))._id;
    else entityId = filterOpts._id;
    return entityId;
  }

  async findOne(
    operator: Operator,
    filterOpts: any,
    populate?: any,
    select?: string,
  ) {
    const isGranted = await this.privilegeService.isEntityGranted(
      this.domain,
      operator,
      await this.getEntityId(filterOpts),
      Action.READ,
    );
    if (!isGranted) throw new ForbiddenException();
    return this.model
      .findOne({ ...filterOpts })
      .populate(populate)
      .select(select)
      .exec();
  }

  async find(
    operator: Operator,
    filterOpts: any,
    populate?: any,
    select?: string,
  ) {
    const ids = await this.privilegeService.getGrantedEntitiesIds(
      this.domain,
      operator,
      Action.READ,
    );
    if (await this.privilegeService.hasManagePrivilege(operator, this.domain)) {
      return await this.model
        .find({ ...filterOpts })
        .populate(populate)
        .select(select)
        .exec();
    }
    if (filterOpts === undefined) {
      return this.model
        .find({ ...filterOpts, _id: { $in: ids } })
        .populate(populate)
        .select(select)
        .exec();
    } else {
      const isGranted = await this.privilegeService.isEntityGranted(
        this.domain,
        operator,
        await this.getEntityId(filterOpts),
        Action.READ,
      );
      if (!isGranted) throw new ForbiddenException();
      return this.model
        .find({ ...filterOpts, _id: { $in: ids } })
        .populate(populate)
        .select(select)
        .exec();
    }
  }

  async findOneAndUpdate(
    operator: Operator,
    filterOpts: any,
    updateQuery: any,
    populate?: any,
    select?: string,
  ) {
    const isGranted = await this.privilegeService.isEntityGranted(
      this.domain,
      operator,
      await this.getEntityId(filterOpts),
      Action.UPDATE,
    );
    if (!isGranted) throw new ForbiddenException();
    return await this.model
      .findOneAndUpdate(filterOpts, updateQuery, {
        new: true,
      })
      .populate(populate)
      .select(select)
      .exec();
  }

  async findOneAndDelete(operator: Operator, filterOpts: any) {
    const isGranted = await this.privilegeService.isEntityGranted(
      this.domain,
      operator,
      await this.getEntityId(filterOpts),
      Action.DELETE,
    );
    if (!isGranted) throw new ForbiddenException();
    return await this.model.findOneAndDelete(filterOpts);
  }
}
