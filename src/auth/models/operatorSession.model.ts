import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, now } from 'mongoose';
import { Operator } from 'src/operator/models/operator.model';

export type OperatorSessionDocument = OperatorSession & Document;

@Schema({ timestamps: true })
export class OperatorSession {
  @Prop({ required: true, unique: true })
  access_token: string;

  @Prop({
    required: true,
    unique: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Operator',
  })
  operator: Operator;

  @Prop({ default: now() })
  createdAt: Date;
}

export const OperatorSessionSchema =
  SchemaFactory.createForClass(OperatorSession);
