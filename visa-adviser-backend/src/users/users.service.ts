import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(payload: Partial<User>) {
    return this.userModel.create(payload);
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() });
  }

  async syncAdminByEmail(
    email: string,
    payload: Pick<User, 'passwordHash' | 'role' | 'isVerified' | 'verifiedAt'>,
  ) {
    return this.userModel.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: payload },
      { new: true },
    );
  }

  findByReferralCode(referralCode: string) {
    const c = referralCode.trim().toUpperCase();
    return this.userModel.findOne({ referralCode: c });
  }

  findById(id: string | Types.ObjectId) {
    return this.userModel.findById(id);
  }

  findByIdLeanPublic(id: string) {
    return this.userModel
      .findById(id)
      .select('-passwordHash')
      .lean()
      .exec();
  }

  async verifyUser(userId: string) {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { isVerified: true, verifiedAt: new Date() },
        { new: true },
      )
      .select('-passwordHash')
      .lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async addDirectReferral(parentId: Types.ObjectId, userId: Types.ObjectId) {
    await this.userModel.updateOne(
      { _id: parentId },
      { $addToSet: { directReferrals: userId } },
    );
  }

  async getDashboard(userId: string) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const levelOne = await this.userModel
      .find({ parentId: user._id })
      .select('fullName email referralCode activePoints rank createdAt')
      .lean();
    const levelMap = new Map<string, any[]>();
    levelMap.set(user._id.toString(), levelOne);
    let previousLevel = levelOne;
    for (let depth = 2; depth <= 4; depth += 1) {
      const parentIds = previousLevel.map((u) => u._id);
      if (parentIds.length === 0) break;
      const next = await this.userModel
        .find({ parentId: { $in: parentIds } })
        .select(
          'fullName email referralCode parentId activePoints rank createdAt',
        )
        .lean();
      next.forEach((u) => {
        const key = String(u.parentId);
        const current = levelMap.get(key) ?? [];
        current.push(u);
        levelMap.set(key, current);
      });
      previousLevel = next;
    }

    return {
      profile: {
        fullName: user.fullName,
        email: user.email,
        referralCode: user.referralCode,
        isVerified: user.isVerified,
      },
      totalPoints: user.activePoints,
      pendingPoints: user.pendingPoints,
      expiredPoints: user.expiredPoints,
      rank: user.rank,
      rewards: user.rewards,
      progress: {
        toGold: Math.max(0, 52 - user.activePoints),
        toPlatinum: Math.max(0, 116 - user.activePoints),
        toSuperPlatinum: Math.max(0, 200 - user.activePoints),
      },
      referralTree: levelOne.map((child) => ({
        ...child,
        referrals: levelMap.get(child._id.toString()) ?? [],
      })),
    };
  }

  listAll() {
    return this.userModel
      .find()
      .select('-passwordHash')
      .sort({ createdAt: -1 });
  }

  listTopRated(limit = 10) {
    return this.userModel
      .find({ isVerified: true, activePoints: { $gt: 0 } })
      .select('fullName rank activePoints')
      .sort({ activePoints: -1, createdAt: 1 })
      .limit(limit)
      .lean();
  }
}
