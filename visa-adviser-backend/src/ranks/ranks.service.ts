import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  RankHistory,
  RankHistoryDocument,
} from './schemas/rank-history.schema';
import { RANK_RULES } from '../common/constants';

@Injectable()
export class RanksService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(RankHistory.name)
    private readonly rankHistoryModel: Model<RankHistoryDocument>,
  ) {}

  async evaluateAndUpgrade(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) return;
    const directCount = user.directReferrals.length;
    const eligible = RANK_RULES.find(
      (rule) =>
        user.activePoints >= rule.minPoints &&
        directCount >= rule.minDirectReferrals,
    );
    if (!eligible || eligible.name === user.rank) return;
    await this.rankHistoryModel.create({
      userId: user._id,
      previousRank: user.rank,
      newRank: eligible.name,
    });
    user.rank = eligible.name;
    await user.save();
  }
}
