import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
    @Prop({ required: true })
    action: string;

    @Prop({ required: true })
    resource: string;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    userId?: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Tenant' })
    tenantId?: Types.ObjectId;

    @Prop({ type: String })
    userEmail?: string;

    @Prop({ type: String })
    userName?: string;

    @Prop({ type: String })
    ipAddress?: string;

    @Prop({ type: String })
    userAgent?: string;

    @Prop({ type: Object })
    requestBody?: any;

    @Prop({ type: Object })
    responseBody?: any;

    @Prop({ type: Number })
    statusCode?: number;

    @Prop({ type: String })
    method?: string;

    @Prop({ type: String })
    url?: string;

    @Prop({ type: Number })
    executionTime?: number;

    @Prop({ type: String, enum: ['SUCCESS', 'ERROR', 'WARNING'], default: 'SUCCESS' })
    status: string;

    @Prop({ type: String })
    errorMessage?: string;

    @Prop({ type: Object })
    metadata?: any;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

// Индексы для быстрого поиска
AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ tenantId: 1, createdAt: -1 });
AuditLogSchema.index({ status: 1, createdAt: -1 }); 