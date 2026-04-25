import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PointsService } from '../points/points.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly pointsService: PointsService,
  ) {}

  listUsers() {
    return this.usersService.listAll();
  }

  async verifyUser(userId: string) {
    await this.usersService.verifyUser(userId);
    await this.pointsService.activatePendingPoints(userId);
    const fresh = await this.usersService.findByIdLeanPublic(userId);
    if (!fresh) {
      throw new NotFoundException('User not found');
    }
    return fresh;
  }
}
