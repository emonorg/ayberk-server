import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, now } from 'mongoose';
import { Project } from 'src/project/models/project.model';

export type VariableDocument = Variable & Document;

export type VariableValueType = string | number | boolean | object;

@Schema({ timestamps: true })
export class Variable {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'project' })
  project: Project;

  @Prop({
    required: true,
    unique: true,
  })
  key: string;

  @Prop({
    required: true,
    default: null,
    type: Object,
  })
  value: VariableValueType;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const VariableSchema = SchemaFactory.createForClass(Variable);
