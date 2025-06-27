import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { AuditService } from './audit.service';
import { AuditStatus } from './dto/create-audit-log.dto';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
    private readonly logger = new Logger(AuditLogInterceptor.name);

    constructor(private readonly auditService: AuditService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();
        const startTime = Date.now();

      
        const user = (request as any).user;
        const tenantId = (request as any).tenantId;

       
        const action = this.getActionFromMethod(request.method);
        const resource = this.getResourceFromUrl(request.url);

        return next.handle().pipe(
            tap((data) => {
                const executionTime = Date.now() - startTime;

               
                this.auditService.createAuditLog({
                    action,
                    resource,
                    userId: user?.id,
                    tenantId,
                    userEmail: user?.email,
                    userName: user?.name,
                    ipAddress: this.getClientIp(request),
                    userAgent: request.get('User-Agent'),
                    requestBody: this.sanitizeRequestBody(request.body),
                    responseBody: this.sanitizeResponseBody(data),
                    statusCode: response.statusCode,
                    method: request.method,
                    url: request.url,
                    executionTime,
                    status: AuditStatus.SUCCESS,
                    metadata: {
                        headers: this.sanitizeHeaders(request.headers),
                        query: request.query,
                        params: request.params,
                    },
                }).catch((error) => {
                    this.logger.error(`Failed to create audit log: ${error.message}`);
                });
            }),
            catchError((error) => {
                const executionTime = Date.now() - startTime;

                
                this.auditService.createAuditLog({
                    action,
                    resource,
                    userId: user?.id,
                    tenantId,
                    userEmail: user?.email,
                    userName: user?.name,
                    ipAddress: this.getClientIp(request),
                    userAgent: request.get('User-Agent'),
                    requestBody: this.sanitizeRequestBody(request.body),
                    statusCode: error.status || 500,
                    method: request.method,
                    url: request.url,
                    executionTime,
                    status: AuditStatus.ERROR,
                    errorMessage: error.message,
                    metadata: {
                        headers: this.sanitizeHeaders(request.headers),
                        query: request.query,
                        params: request.params,
                        stack: error.stack,
                    },
                }).catch((auditError) => {
                    this.logger.error(`Failed to create error audit log: ${auditError.message}`);
                });

                throw error;
            }),
        );
    }

    private getActionFromMethod(method: string): string {
        const actionMap = {
            GET: 'READ',
            POST: 'CREATE',
            PUT: 'UPDATE',
            PATCH: 'UPDATE',
            DELETE: 'DELETE',
        };
        return actionMap[method] || 'UNKNOWN';
    }

    private getResourceFromUrl(url: string): string {
        
        const cleanUrl = url.split('?')[0].replace(/^\/api\/v\d+\//, '');
        return cleanUrl || 'root';
    }

    private getClientIp(request: Request): string {
        return (
            (request.headers['x-forwarded-for'] as string)?.split(',')[0] ||
            (request.headers['x-real-ip'] as string) ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            'unknown'
        );
    }

    private sanitizeRequestBody(body: any): any {
        if (!body) return null;

        const sanitized = { ...body };

        
        const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
        sensitiveFields.forEach(field => {
            if (sanitized[field]) {
                sanitized[field] = '[REDACTED]';
            }
        });

        return sanitized;
    }

    private sanitizeResponseBody(data: any): any {
        if (!data) return null;

       
        const maxSize = 1000;
        const dataStr = JSON.stringify(data);

        if (dataStr.length > maxSize) {
            return {
                truncated: true,
                size: dataStr.length,
                preview: dataStr.substring(0, maxSize) + '...',
            };
        }

        return data;
    }

    private sanitizeHeaders(headers: any): any {
        const sanitized = { ...headers };

       
        const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
        sensitiveHeaders.forEach(header => {
            if (sanitized[header]) {
                sanitized[header] = '[REDACTED]';
            }
        });

        return sanitized;
    }
}