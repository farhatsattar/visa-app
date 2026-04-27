import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { ReferralsService } from '../referrals/referrals.service';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly referralsService: ReferralsService,
  ) {}

  async onModuleInit() {
    await this.ensureAdminUser();
  }

  private adminEmailNormalized(): string {
    return (
      this.config.get<string>('ADMIN_EMAIL', 'worldwidevisaadviser.com@gmail.com') ??
      'worldwidevisaadviser.com@gmail.com'
    )
      .toLowerCase()
      .trim();
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private adminPassword(): string {
    return (
      this.config.get<string>('ADMIN_PASSWORD', 'worlwide1990@') ?? 'worlwide1990@'
    ).trim();
  }

  private async ensureAdminUser() {
    const adminEmail = this.adminEmailNormalized();
    const adminExists = await this.usersService.findByEmail(adminEmail);
    if (adminExists) {
      await this.usersService.syncAdminByEmail(adminEmail, {
        passwordHash: await bcrypt.hash(this.adminPassword(), 10),
        role: 'ADMIN',
        isVerified: true,
        verifiedAt: new Date(),
      });
      this.logger.log(`Admin credentials synchronized for ${adminEmail}`);
      return;
    }

    const baseReferralCode = 'ADMIN01';
    let referralCode = baseReferralCode;
    let suffix = 1;
    while (await this.usersService.findByReferralCode(referralCode)) {
      referralCode = `${baseReferralCode}${suffix}`;
      suffix += 1;
    }

    await this.usersService.createUser({
      fullName: 'System Admin',
      email: adminEmail,
      passwordHash: await bcrypt.hash(this.adminPassword(), 10),
      referralCode,
      role: 'ADMIN',
      isVerified: true,
      verifiedAt: new Date(),
    });

    this.logger.log(`Auto-created admin user for ${adminEmail}`);
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
    let isValid = await bcrypt.compare(dto.password, user.passwordHash);
    const isAdminEmail = emailNorm === this.adminEmailNormalized();

    // Self-heal admin credentials drift across deployments/config changes.
    if (!isValid && isAdminEmail && dto.password === this.adminPassword()) {
      await this.usersService.syncAdminByEmail(emailNorm, {
        passwordHash: await bcrypt.hash(this.adminPassword(), 10),
        role: 'ADMIN',
        isVerified: true,
        verifiedAt: new Date(),
      });
      isValid = true;
      this.logger.log(`Admin password hash auto-synchronized on login for ${emailNorm}`);
    }

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
