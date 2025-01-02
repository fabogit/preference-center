import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { TestController } from './test.controller';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';

@Module({
  // imports: [UsersModule, EventsModule],
  controllers: [AppController, TestController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
