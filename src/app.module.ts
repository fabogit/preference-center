import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';
import { ConsentsModule } from './modules/consents/consents.module';
import { LifecycleService } from './common/lifecycle.service';

@Module({
  exports: [],
  imports: [PrismaModule, UsersModule, EventsModule, ConsentsModule],
  // PrismaService is provided by PrismaModule
  providers: [LifecycleService],
})
export class AppModule {}
