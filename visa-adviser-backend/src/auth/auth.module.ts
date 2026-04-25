import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { ReferralsModule } from '../referrals/referrals.module';
import { RolesGuard } from './roles.guard';
import { JWT_STRATEGY_NAME } from '../common/constants';

/** Global so JwtStrategy + JwtModule are available to Users/Admin guards without circular imports. */
@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: JWT_STRATEGY_NAME }),
    UsersModule,
    ReferralsModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, RolesGuard],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule, JwtStrategy, RolesGuard],
})
export class AuthModule {}
