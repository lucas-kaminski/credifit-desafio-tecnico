import { Controller, Get, Query } from '@nestjs/common';
import { HealthService, HealthResponse } from './health.service';
import {
  BadRequestException,
  NotFoundException,
} from '../../shared/exceptions';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth(): HealthResponse {
    return this.healthService.getHealth();
  }

  @Get('error-examples')
  getErrorExamples(@Query('type') type: string): never {
    switch (type) {
      case 'bad-request':
        throw new BadRequestException('This is a bad request example');
      case 'not-found':
        throw new NotFoundException('This is a not found example');
      default:
        throw new Error('This is an unhandled error example');
    }
  }
}
