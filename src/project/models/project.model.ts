import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, now } from 'mongoose';
import { Environment } from 'src/environment/models/environment.model';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Environment' })
  environment: Environment;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Variable' }],
    default: [],
  })
  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.index({ name: 1, environment: 1 }, { unique: true });
