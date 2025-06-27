import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuditService } from '../audit.service';
import { AUDIT_METADATA_KEY, AuditOptions } from '../decorators/audit.decorator';
import { AuditStatus } from '../dto/create-audit-log.dto';

@Injectable()
export class AuditDecoratorInterceptor implements NestInterceptor {
    private readonly logger = new Logger(AuditDecoratorInterceptor.name);

    constructor(
        private readonly auditService: AuditService,
        private readonly reflector: Reflector,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const auditOptions = this.reflector.get<AuditOptions>(
            AUDIT_METADATA_KEY,
            context.getHandler(),
        );

        if (!auditOptions || auditOptions.skip) {
            return next.handle();
        }

        const request = context.switchToHttp().getRequest<Request>();
        const user = (request as any).user;
        const tenantId = (request as any).tenantId;
        const startTime = Date.now();

        return next.handle().pipe(
            tap((result) => {
                const executionTime = Date.now() - startTime;

                
                const customData = auditOptions.customData
                    ? auditOptions.customData(context.getArgs(), result)
                    : {};

                this.auditService.createAuditLog({
                    action: auditOptions.action,
                    resource: auditOptions.resource,
                    userId: user?.id,
                    tenantId,
                    userEmail: user?.email,
                    userName: user?.name,
                    ipAddress: this.getClientIp(request),
                    userAgent: request.get('User-Agent'),
                    method: request.method,
                    url: request.url,
                    executionTime,
                    status: AuditStatus.SUCCESS,
                    metadata: {
                        ...customData,
                        decorator: true,
                    },
                }).catch((error) => {
                    this.logger.error(`Failed to create audit log from decorator: ${error.message}`);
                });
            }),
            catchError((error) => {
                const executionTime = Date.now() - startTime;

                this.auditService.createAuditLog({
                    action: auditOptions.action,
                    resource: auditOptions.resource,
                    userId: user?.id,
                    tenantId,
                    userEmail: user?.email,
                    userName: user?.name,
                    ipAddress: this.getClientIp(request),
                    userAgent: request.get('User-Agent'),
                    method: request.method,
                    url: request.url,
                    executionTime,
                    status: AuditStatus.ERROR,
                    errorMessage: error.message,
                    metadata: {
                        decorator: true,
                        stack: error.stack,
                    },
                }).catch((auditError) => {
                    this.logger.error(`Failed to create error audit log from decorator: ${auditError.message}`);
                });

                throw error;
            }),
        );
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
} 