import { Module } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { PointsModule } from '../points/points.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PointsModule,
  ],
  providers: [ReferralsService],
  exports: [ReferralsService],
})
export class ReferralsModule {}
