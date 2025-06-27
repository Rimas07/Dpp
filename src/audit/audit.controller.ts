import {
    Controller,
    Get,
    Post,
    Query,
    Param,
    UseGuards,
    UseInterceptors,
    Logger,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';
import { Audit, AuditActions, AuditResources } from './decorators/audit.decorator';
import { AuditDecoratorInterceptor } from './interceptors/audit-decorator.interceptor';

@Controller('audit')
@UseInterceptors(AuditDecoratorInterceptor)
export class AuditController {
    private readonly logger = new Logger(AuditController.name);

    constructor(private readonly auditService: AuditService) { }

    @Get()
    @Audit({
        action: AuditActions.AUDIT_LOG_VIEW,
        resource: AuditResources.AUDIT_LOGS,
    })
    async findAll(@Query() queryDto: QueryAuditLogDto) {
        this.logger.log(`Fetching audit logs with filters: ${JSON.stringify(queryDto)}`);
        return this.auditService.findAll(queryDto);
    }

    @Get('stats')
    @Audit({
        action: AuditActions.AUDIT_LOG_VIEW,
        resource: AuditResources.AUDIT_LOGS,
    })
    async getStats(
        @Query('tenantId') tenantId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        this.logger.log(`Fetching audit stats for tenant: ${tenantId}`);

        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;

        return this.auditService.getAuditStats(tenantId, start, end);
    }

    @Get('user/:userId')
    @Audit({
        action: AuditActions.AUDIT_LOG_VIEW,
        resource: AuditResources.AUDIT_LOGS,
    })
    async findByUserId(
        @Param('userId') userId: string,
        @Query('limit') limit?: number,
    ) {
        this.logger.log(`Fetching audit logs for user: ${userId}`);
        return this.auditService.findByUserId(userId, limit);
    }

    @Get('tenant/:tenantId')
    @Audit({
        action: AuditActions.AUDIT_LOG_VIEW,
        resource: AuditResources.AUDIT_LOGS,
    })
    async findByTenantId(
        @Param('tenantId') tenantId: string,
        @Query('limit') limit?: number,
    ) {
        this.logger.log(`Fetching audit logs for tenant: ${tenantId}`);
        return this.auditService.findByTenantId(tenantId, limit);
    }

    @Get(':id')
    @Audit({
        action: AuditActions.AUDIT_LOG_VIEW,
        resource: AuditResources.AUDIT_LOGS,
    })
    async findById(@Param('id') id: string) {
        this.logger.log(`Fetching audit log: ${id}`);
        return this.auditService.findById(id);
    }

    @Post('cleanup')
    @HttpCode(HttpStatus.OK)
    @Audit({
        action: 'AUDIT_CLEANUP',
        resource: AuditResources.AUDIT_LOGS,
    })
    async cleanupOldLogs(@Query('daysToKeep') daysToKeep?: number) {
        this.logger.log(`Cleaning up audit logs older than ${daysToKeep || 90} days`);
        const deletedCount = await this.auditService.cleanupOldLogs(daysToKeep);

        return {
            message: `Successfully cleaned up ${deletedCount} old audit logs`,
            deletedCount,
        };
    }

    @Post('export')
    @Audit({
        action: AuditActions.AUDIT_LOG_EXPORT,
        resource: AuditResources.AUDIT_LOGS,
    })
    async exportLogs(@Query() queryDto: QueryAuditLogDto) {
        this.logger.log(`Exporting audit logs with filters: ${JSON.stringify(queryDto)}`);

       
        const logs = await this.auditService.findAll(queryDto);

        return {
            message: 'Audit logs export completed',
            totalExported: logs.total,
            downloadUrl: `/audit/export/download/${Date.now()}`, 
        };
    }
} 