import { Module } from '@nestjs/common';
import dotenv from 'dotenv';
dotenv.config();
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ChallengesModule } from './challenges/challenges.module.js';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URI!), ChallengesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
