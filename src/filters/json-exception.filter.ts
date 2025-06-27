import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class JsonExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'Internal Server Error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const response = exception.getResponse();
            message = typeof response === 'string' ? response : (response as any).message;
            error = (response as any).error || 'Bad Request';
        } else if (exception instanceof SyntaxError && exception.message.includes('JSON')) {
            status = HttpStatus.BAD_REQUEST;
            message = 'Invalid JSON format';
            error = 'Bad Request';
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
            error,
        });
    }
} 