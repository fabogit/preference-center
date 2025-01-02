import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { TestController } from './test.controller';

@Module({
  imports: [],
  controllers: [AppController, TestController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
