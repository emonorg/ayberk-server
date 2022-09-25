import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import mongoose, { Document, now } from 'mongoose';
import { Privilege } from './privilege.model';

export type OperatorDocument = Operator & Document;

@Schema({ timestamps: true })
export class Operator {
  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @Prop({
    required: true,
  })
  @Exclude()
  encryptedPassword: string;

  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Privilege' }],
    ref: Privilege.name,
    default: [],
  })
  privileges: Privilege[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const OperatorSchema = SchemaFactory.createForClass(Operator);
