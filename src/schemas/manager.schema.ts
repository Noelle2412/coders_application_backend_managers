import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ManagerDocument = HydratedDocument<Manager>;

@Schema({ timestamps: true })
export class Manager {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ default: '' })
  about: string;

  @Prop({ default: false })
  is_verified: boolean;
}

export const ManagerSchema = SchemaFactory.createForClass(Manager);
