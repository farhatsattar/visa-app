import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('dashboard')
export class DashboardController {
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
