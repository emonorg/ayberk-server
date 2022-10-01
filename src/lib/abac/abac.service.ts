import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Operator } from 'src/operator/models/operator.model';
import { Action, PrivilegeDomain } from 'src/operator/models/privilege.model';
import { OperatorService } from 'src/operator/operator.service';

@Injectable()
export abstract class ABACService<T> {
  @Inject() private operatorService: OperatorService;
  constructor(private domain: PrivilegeDomain, readonly model: Model<T>) {}

  async getEntityId(filterOpts) {
    let entityId = null;
    if (!filterOpts.id)
      entityId = await (await this.model.findOne(filterOpts))._id;
    else entityId = filterOpts._id;
    return entityId;
  }

  async find(
    operator: Operator,
    filterOpts: any,
    populate?: any,
    select?: string,
  ) {
    if (await this.operatorService.hasManagePrivilege(operator, this.domain)) {
      return await this.model
        .find({ ...filterOpts })
        .populate(populate)
        .select(select)
        .exec();
    }
    if (filterOpts === undefined) {
      const ids = await this.operatorService.getGrantedEntitiesIds(
        this.domain,
        operator,
        Action.READ,
      );
      return this.model
        .find({ ...filterOpts, _id: { $in: ids } })
        .populate(populate)
        .select(select)
        .exec();
    } else {
      const isGranted = await this.operatorService.isEntityGranted(
        this.domain,
        operator,
        await this.getEntityId(filterOpts),
        Action.READ,
      );
      if (!isGranted) throw new ForbiddenException();
      return this.model
        .find({ ...filterOpts })
        .populate(populate)
        .select(select)
        .exec();
    }
  }

  async findOneAndUpdate(
    operator: Operator,
    filterOpts: any,
    updateQuery: any,
  ) {
    const isGranted = await this.operatorService.isEntityGranted(
      this.domain,
      operator,
      await this.getEntityId(filterOpts),
      Action.UPDATE,
    );
    if (!isGranted) throw new ForbiddenException();
    return await this.model.findOneAndUpdate(filterOpts, updateQuery, {
      new: true,
    });
  }

  async findOneAndDelete(operator: Operator, filterOpts: any) {
    const isGranted = await this.operatorService.isEntityGranted(
      this.domain,
      operator,
      await this.getEntityId(filterOpts),
      Action.DELETE,
    );
    if (!isGranted) throw new ForbiddenException();
    return await this.model.findOneAndDelete(filterOpts);
  }
}
