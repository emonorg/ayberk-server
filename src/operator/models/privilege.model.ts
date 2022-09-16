import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Operator } from './operator.model';

export type PrivilegeDocument = Privilege & Document;

export interface IActions {
  read: boolean;
  write: boolean;
  delete: boolean;
  update: boolean;
}

@Schema()
export class Privilege {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Operator' })
  operator: Operator;

  @Prop({
    required: true,
  })
  domain: string;

  @Prop({
    required: true,
    type: Object,
  })
  actions: IActions;
}

export const PrivilegeSchema = SchemaFactory.createForClass(Privilege);
