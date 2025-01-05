import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

/**
 * Service to handle application lifecycle events, including graceful shutdown.
 */
@Injectable()
export class LifecycleService implements OnApplicationShutdown {
  private readonly logger = new Logger(LifecycleService.name, {
    timestamp: true,
  });

  /**
   * Constructs the LifecycleService.
   * @param prismaService - Instance of PrismaService for managing database connections.
   */
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Triggered when the application begins the shutdown process.
   * Cleans up resources and ensures all services are properly terminated.
   * @param signal - Signal that triggered the shutdown (e.g., "SIGINT" or "SIGTERM").
   */
  async onApplicationShutdown(signal?: string) {
    this.logger.warn(`Application shutdown triggered by signal: ${signal}`);
    try {
      await this.cleanupResources();
      this.logger.log('All resources cleaned up successfully.');
    } catch (error) {
      this.logger.error('Error during application shutdown:', error.stack);
    }
  }

  /**
   * Performs cleanup of all resources during application shutdown.
   * Currently handles Prisma service cleanup and can be extended for other services.
   */
  private async cleanupResources() {
    this.logger.warn('Starting resource cleanup...');
    try {
      await this.prismaService.onModuleDestroy();
      this.logger.log('Prisma service cleanup completed.');
    } catch (error) {
      this.logger.error('Error during Prisma service cleanup:', error.stack);
    }
    // Add cleanup logic for other services here (e.g., Redis, Kafka)
  }
}
