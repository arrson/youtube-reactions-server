import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
  constructor(private readonly appService: HealthService) {}

  @Get()
  @ApiOkResponse({ schema: { type: 'boolean' } })
  getHealth(): boolean {
    return this.appService.getHealth();
  }
}
