import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';

@Injectable()
export class PrismaErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error.code === 'P2002') {
          throw new ConflictException('Duplicate value violation');
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('Record not found');
        }
        throw error; // Propagate other unhandled errors
      }),
    );
  }
}
