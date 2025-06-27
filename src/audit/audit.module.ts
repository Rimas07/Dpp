import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { AuditLogInterceptor } from './audit-log.interceptor';
import { AuditDecoratorInterceptor } from './interceptors/audit-decorator.interceptor';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: AuditLog.name, schema: AuditLogSchema },
        ]),
    ],
    controllers: [AuditController],
    providers: [
        AuditService,
        AuditLogInterceptor,
        AuditDecoratorInterceptor,
    ],
    exports: [
        AuditService,
        AuditLogInterceptor,
        AuditDecoratorInterceptor,
    ],
})
export class AuditModule { } 