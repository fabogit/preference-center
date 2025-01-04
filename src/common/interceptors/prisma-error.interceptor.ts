import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Observable, catchError } from 'rxjs';

@Injectable()
export class PrismaErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // Handle Prisma-specific known errors
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ConflictException('Duplicate value violation');
          }
          if (error.code === 'P2025') {
            throw new NotFoundException('Record not found');
          }
        }

        // Log and handle unhandled errors
        console.error('Unhandled error:', error);
        throw new InternalServerErrorException('An unexpected error occurred');
      }),
    );
  }
}
