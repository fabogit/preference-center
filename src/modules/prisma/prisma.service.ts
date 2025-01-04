import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  OnApplicationShutdown,
  ShutdownSignal,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  constructor() {
    super();
    this.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      this.logger.log(
        `Query ${params.model}.${params.action} took ${after - before}ms`,
      );
      return result;
    });
  }

  private readonly logger = new Logger(PrismaService.name, { timestamp: true });

  async onModuleInit() {
    try {
      this.logger.log('Connecting to the database...');
      await this.$connect();
      this.logger.log('Database connection established.');
    } catch (error) {
      this.logger.error('Failed to connect to the database:', error.stack);
      throw error; // Re-throw the error so it propagates properly
    }
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from the database...');
    await this.$disconnect();
    this.logger.log('Database connection closed.');
  }

  async onApplicationShutdown(signal?: ShutdownSignal) {
    this.logger.log(`Application shutdown triggered by signal: ${signal}`);
    this.logger.log(
      'Disconnecting from the database (application shutdown)...',
    );
    await this.$disconnect();
    this.logger.log('Database connection closed.');
  }
}
