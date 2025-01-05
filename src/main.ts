import { Logger, NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/exceptionFilter';
import { PrismaService } from './modules/prisma/prisma.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap', { timestamp: true });

  logger.log('Initializing application...');
  const factoryOptions: NestApplicationOptions = {};
  const app = await NestFactory.create(AppModule, factoryOptions);

  // Enable shutdown hooks to handle application termination gracefully
  logger.log('Enabling shutdown hooks...');
  app.enableShutdownHooks();

  // Register global exception filter for consistent error handling
  logger.log('Setting up global exception filter...');
  app.useGlobalFilters(new AllExceptionsFilter());

  // Attempt database connection and ensure Prisma readiness
  logger.log('Attempting database connection...');
  const prismaService = app.get(PrismaService);
  try {
    await prismaService.onModuleInit();
    logger.log('Database connection established successfully.');
  } catch (error) {
    logger.error('Failed to connect to the database:', error.stack);
    process.exit(1);
  }

  // Configure global validation pipes for DTO validation
  logger.log('Setting up validation pipes...');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip out properties not in DTO
      forbidNonWhitelisted: true, // Reject unknown properties
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Set up Swagger for API documentation
  logger.log('Configuring Swagger documentation...');
  const config = new DocumentBuilder()
    .setTitle('Preference Center - API')
    .setDescription('API for managing users consents')
    .setVersion('1.0')
    .addTag('Users')
    .addTag('Consents')
    // Add authentication if needed
    // .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Enable Cross-Origin Resource Sharing (CORS)
  logger.log('Enabling CORS...');
  app.enableCors();

  // Start the application on the configured port
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
