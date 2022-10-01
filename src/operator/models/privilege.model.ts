import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, now } from 'mongoose';
import { Operator } from './operator.model';

export enum PrivilegeDomain {
  ALL = 'all',
  OPERATORS = 'operators',
  PRIVILEGE = 'privileges',
  ENVS = 'environments',
  PROJECTS = 'projects',
  VARIABLES = 'variables',
  SETTINGS = 'settings',
}
export interface IActions {
  manage: boolean;
  read?: boolean;
  create?: boolean;
  delete?: boolean;
  update?: boolean;
}

export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export interface IPrivilege {
  domain: PrivilegeDomain;
  action: Action;
}

export type PrivilegeDocument = Privilege & Document;

@Schema({ timestamps: true })
export class Privilege {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Operator',
  })
  operator: Operator;

  @Prop({
    required: true,
    type: String,
    enum: PrivilegeDomain,
  })
  domain: PrivilegeDomain;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  })
  entityId: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: Object,
  })
  actions: IActions;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const PrivilegeSchema = SchemaFactory.createForClass(Privilege);
PrivilegeSchema.index(
  { operator: 1, domain: 1, actions: 1, entityId: 1 },
  { unique: true },
);
