import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './modules/prisma/prisma.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';
import { TestController } from './test.controller';

@Module({
  imports: [PrismaModule, UsersModule, EventsModule],
  controllers: [AppController, TestController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
