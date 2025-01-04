import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { PrismaErrorInterceptor } from './common/interceptors/prisma-error.interceptor';
import { PrismaService } from './modules/prisma/prisma.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  logger.log('Initializing application...');
  const app = await NestFactory.create(AppModule);

  logger.log('Enabling shutdown hooks...');
  app.enableShutdownHooks();

  logger.log('Attempting database connection...');
  const prismaService = app.get(PrismaService);
  try {
    await prismaService.onModuleInit();
    logger.log('Database connection established successfully.');
  } catch (error) {
    logger.error('Failed to connect to the database:', error.stack);
    process.exit(1);
  }

  logger.log('Setting up validation pipes...');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  logger.log('Setting up global interceptors...');
  app.useGlobalInterceptors(new PrismaErrorInterceptor());

  logger.log('Configuring Swagger documentation...');
  const config = new DocumentBuilder()
    .setTitle('Preference Center - API')
    .setDescription('API for managing users and consents')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  logger.log('Enabling CORS...');
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
