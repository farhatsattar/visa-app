import { Module } from '@nestjs/common';
import { PointsService } from './points.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PointsHistory,
  PointsHistorySchema,
} from './schemas/points-history.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PointsHistory.name, schema: PointsHistorySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [PointsService],
  exports: [PointsService],
})
export class PointsModule {}
