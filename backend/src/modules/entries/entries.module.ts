import { Module } from '@nestjs/common';
import { EntriesController } from './entries.controller';
import { EntriesService } from './entries.service';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Module({
  controllers: [EntriesController],
  providers: [EntriesService, PrismaService],
  exports: [EntriesService],
})
export class EntriesModule {}
