import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaErrorInterceptor } from './common/interceptors/prisma-error.interceptor';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule, UsersModule, EventsModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: PrismaErrorInterceptor,
    },
  ],
})
export class AppModule {}
