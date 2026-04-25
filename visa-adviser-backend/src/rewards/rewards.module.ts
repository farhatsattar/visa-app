import { Module } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from './schemas/reward.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reward.name, schema: RewardSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {}
