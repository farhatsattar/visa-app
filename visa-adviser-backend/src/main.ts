import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GlobalHttpExceptionFilter } from './common/http-exception.filter';
import helmet from 'helmet';

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
