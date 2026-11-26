import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ChallengesController } from './challenges.controller.js';
import { ChallengesService } from './challenges.service.js';
import { Challenge, ChallengeSchema } from '../schemas/challenge.schema.js';
import { Manager, ManagerSchema } from '../schemas/manager.schema.js';
import dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
      { name: Manager.name, schema: ManagerSchema },
    ]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
})
export class ChallengesModule {}
