import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect(); // Establish the database connection when the module initializes
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Close the database connection when the module is destroyed
  }
}
