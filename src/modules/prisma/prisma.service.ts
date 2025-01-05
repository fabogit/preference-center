import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Service for managing the Prisma Client, including database connections and query monitoring.
 * Extends PrismaClient to integrate lifecycle hooks for connection management.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name, { timestamp: true });

  /**
   * Constructs the PrismaService and sets up middleware for query performance logging.
   */
  constructor() {
    super();
    // this.$extends({
    //   client: {},
    // });
    // TODO deprecated
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

  /**
   * Lifecycle hook that is called when the module is initialized.
   * Establishes the database connection.
   */
  async onModuleInit() {
    try {
      this.logger.log('Connecting to the database...');
      await this.$connect();
      this.logger.log('Database connection established.');
    } catch (error) {
      this.logger.error('Failed to connect to the database:', error.stack);
      throw error;
    }
  }

  /**
   * Lifecycle hook that is called when the module is destroyed.
   * Ensures the database connection is properly closed.
   */
  async onModuleDestroy() {
    this.logger.warn('Disconnecting from the database...');
    await this.$disconnect();
    this.logger.warn('Database connection closed.');
  }

  /**
   * Explicitly disconnects the Prisma Client from the database.
   * Can be used independently when manual disconnection is needed.
   */
  async disconnect() {
    this.logger.warn('Disconnecting from the database...');
    await this.$disconnect();
    this.logger.log('Database connection closed.');
  }
}
