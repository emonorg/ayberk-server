import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, now } from 'mongoose';
import { Project } from 'src/project/models/project.model';

export type EnvironmentDocument = Environment & Document;

@Schema({ timestamps: true })
export class Environment {
  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    ref: Project.name,
  })
  projects: Project[];

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const EnvironmentSchema = SchemaFactory.createForClass(Environment);
