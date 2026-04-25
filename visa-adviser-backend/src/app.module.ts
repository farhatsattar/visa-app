import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ReferralsModule } from './referrals/referrals.module';
import { PointsModule } from './points/points.module';
import { RewardsModule } from './rewards/rewards.module';
import { RanksModule } from './ranks/ranks.module';
import { AdminModule } from './admin/admin.module';
import { JobsModule } from './jobs/jobs.module';
import { DashboardController } from './dashboard/dashboard.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RegistrationModule } from './registration/registration.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_URI'),
      }),
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    CommonModule,
    AuthModule,
    UsersModule,
    ReferralsModule,
    PointsModule,
    RewardsModule,
    RanksModule,
    AdminModule,
    JobsModule,
    RegistrationModule,
  ],
  controllers: [AppController, DashboardController],
  providers: [AppService],
})
export class AppModule {}
