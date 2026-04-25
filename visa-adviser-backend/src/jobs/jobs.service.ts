import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PointsService } from '../points/points.service';
import { RewardsService } from '../rewards/rewards.service';
import { RanksService } from '../ranks/ranks.service';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private readonly pointsService: PointsService,
    private readonly rewardsService: RewardsService,
    private readonly ranksService: RanksService,
  ) {}

  @OnEvent('points.updated')
  async onPointsUpdated(payload: { userId: string }) {
    await this.rewardsService.assignEligibleRewards(payload.userId);
    await this.ranksService.evaluateAndUpgrade(payload.userId);
  }

  @OnEvent('referral.added')
  async onReferralAdded(payload: { userId: string }) {
    await this.ranksService.evaluateAndUpgrade(payload.userId);
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async expirePendingPointsJob() {
    const expiredCount = await this.pointsService.expireOldPendingPoints();
    this.logger.log(`Expired pending transactions: ${expiredCount}`);
  }
}
