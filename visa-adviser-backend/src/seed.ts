import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './users/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const config = app.get(ConfigService);
  const adminEmail = (
    config.get<string>('ADMIN_EMAIL', 'worldwidevisaadviser.com@gmail.com') ?? 'worldwidevisaadviser.com@gmail.com'
  )
    .toLowerCase()
    .trim();
  const adminExists = await userModel.findOne({ email: adminEmail });
  if (!adminExists) {
    await userModel.create({
      fullName: 'System Admin',
      email: adminEmail,
      passwordHash: await bcrypt.hash('worlwide1990@', 10),
      referralCode: 'ADMIN01',
      role: 'ADMIN',
      isVerified: true,
      verifiedAt: new Date(),
    });
  }

  await app.close();

  console.log('Seed complete');
}

void seed();
