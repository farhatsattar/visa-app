import { Module } from '@nestjs/common';
import { RanksService } from './ranks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { RankHistory, RankHistorySchema } from './schemas/rank-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RankHistory.name, schema: RankHistorySchema },
    ]),
  ],
  providers: [RanksService],
  exports: [RanksService],
})
export class RanksModule {}
