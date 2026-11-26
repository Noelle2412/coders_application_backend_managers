import { Module } from '@nestjs/common';
import { ChallengesController } from './challenges.controller.js';
import { ChallengesService } from './challenges.service.js';

@Module({
  controllers: [ChallengesController],
  providers: [ChallengesService]
})
export class ChallengesModule {}
