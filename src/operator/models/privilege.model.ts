import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, now } from 'mongoose';
import { Operator } from './operator.model';

export enum PrivilegeDomains {
  ALL = 'all',
  OPERATORS = 'operators',
  ENVS = 'environments',
  PROJECTS = 'projects',
  SETTINGS = 'settings',
}
export interface IActions {
  manage: boolean;
  read?: boolean;
  create?: boolean;
  delete?: boolean;
  update?: boolean;
}

export type PrivilegeDocument = Privilege & Document;

@Schema({ timestamps: true })
export class Privilege {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Operator' })
  operator: Operator;

  @Prop({
    required: true,
    type: String,
    enum: PrivilegeDomains,
  })
  domain: PrivilegeDomains;

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
