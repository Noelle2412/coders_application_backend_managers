import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Challenge, ChallengeDocument } from '../schemas/challenge.schema.js';
import { Manager, ManagerDocument } from '../schemas/manager.schema.js';
import { CreateChallengeDto } from './dto/create-challenge.dto.js';
import { UpdateChallengeDto } from './dto/update-challenge.dto.js';
import { User } from '../auth/authenticated-user.decorator.js';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenge.name)
    private challengeModel: Model<ChallengeDocument>,
    @InjectModel(Manager.name) private managerModel: Model<ManagerDocument>,
  ) {}

  private assertValidId(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid id');
  }

  async create(dto: CreateChallengeDto, user: User) {
    return this.challengeModel.create({ ...dto, manager: user.id });
  }

  async getAll(user: User) {
    return this.challengeModel.find({ manager: user.id }).exec();
  }

  async getById(id: string, user: User) {
    this.assertValidId(id);
    const challenge = await this.challengeModel
      .findOne({ _id: id, manager: user.id })
      .exec();
    if (!challenge) throw new NotFoundException('Challenge not found');
    return challenge;
  }

  async update(id: string, dto: UpdateChallengeDto, user: User) {
    this.assertValidId(id);
    const challenge = await this.challengeModel
      .findOneAndUpdate({ _id: id, manager: user.id }, dto, { new: true })
      .exec();
    if (!challenge) throw new NotFoundException('Challenge not found');
    return challenge;
  }

  async delete(id: string, user: User) {
    this.assertValidId(id);
    const challenge = await this.challengeModel
      .findOneAndDelete({ _id: id, manager: user.id })
      .exec();
    if (!challenge) throw new NotFoundException('Challenge not found');
    return { message: 'Challenge deleted' };
  }
}
