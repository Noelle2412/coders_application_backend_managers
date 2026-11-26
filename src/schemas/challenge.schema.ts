import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Manager } from './manager.schema.js';

export type ChallengeDocument = HydratedDocument<Challenge>;

// --------------------------------------------------
// CodeText Schema
// --------------------------------------------------

@Schema({ _id: false })
export class CodeText {
  @Prop({
    type: String,
    required: true,
    enum: ['py', 'js'],
  })
  language: string;

  @Prop({ type: String, required: true })
  text: string;
}

export const CodeTextSchema = SchemaFactory.createForClass(CodeText);

// --------------------------------------------------
// Input Schema
// --------------------------------------------------

@Schema({ _id: false })
export class Input {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  type: string;
}

export const InputSchema = SchemaFactory.createForClass(Input);

// --------------------------------------------------
// Code Schema
// --------------------------------------------------

@Schema({ _id: false })
export class Code {
  @Prop({ type: String, required: true })
  function_name: string;

  @Prop({
    type: [CodeTextSchema],
    required: true,
    validate: {
      validator: (v: CodeText[]) =>
        Array.isArray(v) &&
        v.length === 2 &&
        v.some((item) => item.language === 'py') &&
        v.some((item) => item.language === 'js'),
      message: 'code_text must contain exactly 2 items (py and js).',
    },
  })
  code_text: CodeText[];

  @Prop({
    type: [InputSchema],
    required: true,
  })
  inputs: Input[];
}

export const CodeSchema = SchemaFactory.createForClass(Code);

// --------------------------------------------------
// TestInput Schema
// --------------------------------------------------

@Schema({ _id: false })
export class TestInput {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    required: true,
  })
  value: any;
}

export const TestInputSchema = SchemaFactory.createForClass(TestInput);

// --------------------------------------------------
// Test Schema
// --------------------------------------------------

@Schema({ _id: false })
export class Test {
  @Prop({ type: Number })
  weight: number;

  @Prop({
    type: [TestInputSchema],
    required: true,
    validate: {
      validator: (v: TestInput[]) => Array.isArray(v) && v.length >= 1,
      message: 'Test case must contain at least 1 input.',
    },
  })
  inputs: TestInput[];

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    required: true,
  })
  output: any;
}

export const TestSchema = SchemaFactory.createForClass(Test);

// --------------------------------------------------
// Challenge Schema
// --------------------------------------------------

@Schema({ timestamps: true })
export class Challenge {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Manager.name,
  })
  manager: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  category: string;

  @Prop({
    type: String,
    default: '',
    trim: true,
  })
  description: string;

  @Prop({
    type: String,
    required: true,
    enum: ['Easy', 'Moderate', 'Hard'],
  })
  level: string;

  @Prop({
    type: CodeSchema,
    required: true,
  })
  code: Code;

  @Prop({
    type: [TestSchema],
    required: true,
    validate: {
      validator: (v: Test[]) => Array.isArray(v) && v.length >= 1,
      message: 'tests must contain at least 1 test case.',
    },
  })
  tests: Test[];
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
