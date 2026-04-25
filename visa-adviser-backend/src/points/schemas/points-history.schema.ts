import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PointsHistoryDocument = HydratedDocument<PointsHistory>;

@Schema({ timestamps: true })
export class PointsHistory {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({
    enum: ['PENDING_ADD', 'ACTIVATED_ADD', 'EXPIRED_REMOVE'],
    required: true,
  })
  type: 'PENDING_ADD' | 'ACTIVATED_ADD' | 'EXPIRED_REMOVE';

  @Prop({ required: true })
  level: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sourceUserId: Types.ObjectId;

  @Prop({ default: false })
  isExpired: boolean;

  @Prop({ type: Date, default: null })
  expiresAt: Date | null;

  @Prop({ type: Date, default: null })
  activatedAt: Date | null;
}

export const PointsHistorySchema = SchemaFactory.createForClass(PointsHistory);
