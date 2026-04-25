import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { PointsModule } from '../points/points.module';
import { RewardsModule } from '../rewards/rewards.module';
import { RanksModule } from '../ranks/ranks.module';

@Module({
  imports: [PointsModule, RewardsModule, RanksModule],
  providers: [JobsService],
})
export class JobsModule {}
