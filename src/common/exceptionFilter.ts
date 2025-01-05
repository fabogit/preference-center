import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name, {
    timestamp: true,
  });

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // Switch to HTTP context to extract request and response objects
    const response = ctx.getResponse<Response>(); // Get the HTTP response object
    const request = ctx.getRequest<Request>(); // Get the HTTP request object
    const isProduction = process.env.NODE_ENV === 'production';

    // Determine the status code of the response
    const status =
      exception instanceof HttpException
        ? exception.getStatus() // Use the status from HttpException if available
        : HttpStatus.INTERNAL_SERVER_ERROR; // Default to 500 for unknown errors

    // Construct the error response object
    const errorResponse = {
      path: request.url,
      timestamp: new Date().toISOString(),
      statusCode: status,
      details:
        exception instanceof HttpException
          ? exception.message
          : 'Something went wrong!',
      // Hide detailed error stack in production
      ...(isProduction
        ? {}
        : {
            details:
              exception instanceof HttpException
                ? exception.getResponse()
                : exception, // Include the raw exception details for other errors
          }),
    };

    this.logger.error(
      `HTTP ${status} Error: ${JSON.stringify({
        ...errorResponse,
        method: request.method,
        body: request.body,
      })}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // Send the constructed error response to the client
    response.status(status).json(errorResponse);
  }
}
