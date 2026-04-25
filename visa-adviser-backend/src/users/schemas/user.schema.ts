import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: 'USER' })
  role: string;

  @Prop({ required: true, unique: true })
  referralCode: string;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  parentId: Types.ObjectId | null;

  @Prop({ type: [Types.ObjectId], default: [] })
  ancestors: Types.ObjectId[];

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: Date, default: null })
  verifiedAt: Date | null;

  @Prop({ default: 0 })
  activePoints: number;

  @Prop({ default: 0 })
  pendingPoints: number;

  @Prop({ default: 0 })
  expiredPoints: number;

  @Prop({ default: 'Classic' })
  rank: string;

  @Prop({ type: [String], default: [] })
  rewards: string[];

  @Prop({ type: [Types.ObjectId], default: [] })
  directReferrals: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
