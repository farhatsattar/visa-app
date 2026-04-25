import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ReferralsService } from '../referrals/referrals.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly referralsService: ReferralsService,
  ) {}

  private adminEmailNormalized(): string {
    return (
      this.config.get<string>('ADMIN_EMAIL', 'admin@visa.local') ?? 'admin@visa.local'
    )
      .toLowerCase()
      .trim();
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  async register(dto: RegisterDto) {
    const emailNorm = this.normalizeEmail(dto.email);
    if (emailNorm === this.adminEmailNormalized()) {
      throw new BadRequestException(
        'This email is reserved for the system admin',
      );
    }
    const exists = await this.usersService.findByEmail(emailNorm);
    if (exists) throw new BadRequestException('Email already exists');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const created = await this.usersService.createUser({
      fullName: dto.fullName.trim(),
      email: emailNorm,
      passwordHash,
      referralCode: `VW${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      role: 'USER',
    });
    await this.referralsService.handleRegistrationReferral(
      created._id.toString(),
      dto.referralCode?.trim(),
    );
    return this.createToken(created._id.toString(), created.email, 'USER');
  }

  async login(dto: LoginDto) {
    const emailNorm = this.normalizeEmail(dto.email);
    const user = await this.usersService.findByEmail(emailNorm);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');
    const role =
      user.email.toLowerCase() === this.adminEmailNormalized() ? 'ADMIN' : 'USER';
    return this.createToken(user._id.toString(), user.email, role);
  }

  private createToken(sub: string, email: string, role: string) {
    return {
      accessToken: this.jwtService.sign({ sub, email, role }),
      tokenType: 'Bearer',
    };
  }
}
