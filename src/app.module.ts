import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule, UsersModule, EventsModule],
  providers: [],
})
export class AppModule {}
