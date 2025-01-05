import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { LifecycleService } from './common/lifecycle.service';

@Module({
  exports: [],
  imports: [UsersModule, EventsModule, PrismaModule],
  // PrismaService is provided by PrismaModule
  providers: [LifecycleService],
})
export class AppModule {}
