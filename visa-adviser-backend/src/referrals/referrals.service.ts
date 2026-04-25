import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { REFERRAL_LEVEL_POINTS } from '../common/constants';
import { PointsService } from '../points/points.service';

@Injectable()
export class ReferralsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly pointsService: PointsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async handleRegistrationReferral(newUserId: string, referralCode?: string) {
    const code = referralCode?.trim();
    if (!code) return;
    // Stored codes are uppercase (VW…); users often paste lowercase from links.
    const normalized = code.toUpperCase();
    const parent = await this.userModel.findOne({ referralCode: normalized });
    if (!parent) return;
    const newUser = await this.userModel.findById(newUserId);
    if (!newUser) return;

    const parentAncestors = parent.ancestors ?? [];
    const ancestors: Types.ObjectId[] = [parent._id, ...parentAncestors].slice(
      0,
      4,
    );
    newUser.parentId = parent._id;
    newUser.ancestors = ancestors;
    await newUser.save();
    await this.userModel.updateOne(
      { _id: parent._id },
      { $addToSet: { directReferrals: newUser._id } },
    );

    for (let index = 0; index < ancestors.length; index += 1) {
      const level = index + 1;
      const ancestorId = ancestors[index];
      await this.pointsService.addPendingPointsForReferral({
        userId: ancestorId,
        amount: REFERRAL_LEVEL_POINTS[level] ?? 0,
        level,
        sourceUserId: newUser._id,
      });
      this.eventEmitter.emit('points.updated', {
        userId: ancestorId.toString(),
      });
    }
    this.eventEmitter.emit('referral.added', { userId: parent._id.toString() });
  }
}
