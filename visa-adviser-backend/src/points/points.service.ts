import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Model, Types } from 'mongoose';
import {
  PointsHistory,
  PointsHistoryDocument,
} from './schemas/points-history.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class PointsService {
  constructor(
    @InjectModel(PointsHistory.name)
    private readonly pointsModel: Model<PointsHistoryDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async addPendingPointsForReferral(payload: {
    userId: Types.ObjectId;
    amount: number;
    level: number;
    sourceUserId: Types.ObjectId;
  }) {
    const user = await this.userModel.findById(payload.userId);
    if (!user || payload.amount <= 0) return;
    const isVerified = user.isVerified;
    await this.pointsModel.create({
      userId: payload.userId,
      amount: payload.amount,
      type: isVerified ? 'ACTIVATED_ADD' : 'PENDING_ADD',
      level: payload.level,
      sourceUserId: payload.sourceUserId,
      activatedAt: isVerified ? new Date() : null,
      expiresAt: isVerified
        ? null
        : new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    });
    await this.userModel.updateOne(
      { _id: payload.userId },
      isVerified
        ? { $inc: { activePoints: payload.amount } }
        : { $inc: { pendingPoints: payload.amount } },
    );
  }

  async activatePendingPoints(userId: string) {
    const txs = await this.pointsModel.find({
      userId: new Types.ObjectId(userId),
      type: 'PENDING_ADD',
      isExpired: false,
    });
    const total = txs.reduce((acc, tx) => acc + tx.amount, 0);
    if (!total) return;
    await this.pointsModel.updateMany(
      { _id: { $in: txs.map((tx) => tx._id) } },
      {
        $set: {
          type: 'ACTIVATED_ADD',
          activatedAt: new Date(),
          expiresAt: null,
        },
      },
    );
    await this.userModel.updateOne(
      { _id: userId },
      { $inc: { activePoints: total, pendingPoints: -total } },
    );
    this.eventEmitter.emit('points.updated', { userId });
  }

  async expireOldPendingPoints() {
    const now = new Date();
    const txs = await this.pointsModel.find({
      type: 'PENDING_ADD',
      isExpired: false,
      expiresAt: { $lte: now },
    });
    if (!txs.length) return 0;
    const grouped = new Map<string, number>();
    txs.forEach((tx) => {
      const key = tx.userId.toString();
      grouped.set(key, (grouped.get(key) ?? 0) + tx.amount);
    });
    await this.pointsModel.updateMany(
      { _id: { $in: txs.map((tx) => tx._id) } },
      { $set: { isExpired: true, type: 'EXPIRED_REMOVE' } },
    );
    for (const [userId, total] of grouped.entries()) {
      await this.userModel.updateOne(
        { _id: userId },
        { $inc: { pendingPoints: -total, expiredPoints: total } },
      );
    }
    return txs.length;
  }
}
