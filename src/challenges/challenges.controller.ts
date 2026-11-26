import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service.js';
import { CreateChallengeDto } from './dto/create-challenge.dto.js';
import { UpdateChallengeDto } from './dto/update-challenge.dto.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { AuthenticatedUser } from '../auth/authenticated-user.decorator.js';
import type { User } from '../auth/authenticated-user.decorator.js';

@Controller('challenges')
@UseGuards(AuthGuard)
@Roles('Manager')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  create(@Body() dto: CreateChallengeDto, @AuthenticatedUser() user: User) {
    return this.challengesService.create(dto, user);
  }

  @Get()
  findAll(@AuthenticatedUser() user: User) {
    return this.challengesService.getAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AuthenticatedUser() user: User) {
    return this.challengesService.getById(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateChallengeDto,
    @AuthenticatedUser() user: User,
  ) {
    return this.challengesService.update(id, dto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuthenticatedUser() user: User) {
    return this.challengesService.delete(id, user);
  }
}
