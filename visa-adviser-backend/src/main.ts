import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GlobalHttpExceptionFilter } from './common/http-exception.filter';
import helmet from 'helmet';
import type { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = (
    process.env.CORS_ORIGINS ??
    'http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const isProd = process.env.NODE_ENV === 'production';
  const expressApp = app.getHttpAdapter().getInstance();

  // Hide framework fingerprint in production responses.
  expressApp.disable('x-powered-by');
  app.use(helmet());
  app.enableShutdownHooks();

  if (process.env.TRUST_PROXY === 'true') {
    expressApp.set('trust proxy', 1);
  }

  // Keep root probes healthy (Render/edge/browsers may send GET/HEAD on "/").
  expressApp.get('/', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'visa-adviser-backend' });
  });
  expressApp.head('/', (_req: Request, res: Response) => {
    res.sendStatus(200);
  });
  expressApp.get('/healthz', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  app.enableCors({
    // Local dev: allow any origin (Next proxy / various ports). Production: strict list.
    origin: isProd ? allowedOrigins : true,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  app.setGlobalPrefix('api');
  const enableSwagger =
    !isProd || process.env.ENABLE_SWAGGER_IN_PROD === 'true';

  if (enableSwagger) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Worldwide Visa Adviser API')
      .setDescription('Automated MLM referral engine APIs')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
  }

  // Default 4000 so Next (3000) and API don't clash; override with PORT in .env
  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
