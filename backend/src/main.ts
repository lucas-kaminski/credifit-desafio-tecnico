import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { LoggingMiddleware } from './shared/middleware/logging.middleware';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());
  const loggingMiddleware = new LoggingMiddleware();
  app.use((req: Request, res: Response, next: NextFunction) =>
    loggingMiddleware.use(req, res, next),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Erro ao iniciar a aplicação:', err);
  process.exit(1);
});
