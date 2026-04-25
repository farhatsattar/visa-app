import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RankHistoryDocument = HydratedDocument<RankHistory>;

@Schema({ timestamps: true })
export class RankHistory {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  previousRank: string;

  @Prop({ required: true })
  newRank: string;

  @Prop({ type: Date, default: () => new Date() })
  changedAt: Date;
}

export const RankHistorySchema = SchemaFactory.createForClass(RankHistory);
