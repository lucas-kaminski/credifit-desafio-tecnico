import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { EntriesModule } from './modules/entries/entries.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [AuthModule, HealthModule, EntriesModule, SharedModule, UserModule],
})
export class AppModule {}
