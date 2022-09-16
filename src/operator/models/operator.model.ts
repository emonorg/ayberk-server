import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Privilege } from './privilege.model';

export type OperatorDocument = Operator & Document;

@Schema()
export class Operator {
  @Prop({
    required: true,
  })
  username: string;

  @Prop({
    required: true,
  })
  encryptedPassword: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Privilege' }],
    ref: Privilege.name,
  })
  privileges: Privilege[];
}

export const OperatorSchema = SchemaFactory.createForClass(Operator);
