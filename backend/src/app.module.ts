import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { EntriesModule } from './modules/entries/entries.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './modules/user/user.module';
import { ResponseTimeMiddleware } from './shared/middleware/response-time.middleware';

@Module({
  imports: [AuthModule, HealthModule, EntriesModule, SharedModule, UserModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ResponseTimeMiddleware).forRoutes('*');
  }
}
