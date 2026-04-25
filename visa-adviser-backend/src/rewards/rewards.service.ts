import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reward, RewardDocument } from './schemas/reward.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { REWARD_THRESHOLDS } from '../common/constants';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name)
    private readonly rewardModel: Model<RewardDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async assignEligibleRewards(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) return;
    for (const reward of REWARD_THRESHOLDS) {
      if (user.activePoints < reward.points) continue;
      const exists = await this.rewardModel.findOne({
        userId: user._id,
        name: reward.name,
      });
      if (exists) continue;
      await this.rewardModel.create({
        userId: new Types.ObjectId(userId),
        name: reward.name,
        threshold: reward.points,
      });
      await this.userModel.updateOne(
        { _id: user._id },
        { $addToSet: { rewards: reward.name } },
      );
    }
  }
}
