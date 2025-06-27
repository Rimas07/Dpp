import { IsString, IsOptional, IsObject, IsEnum, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export enum AuditStatus {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
    WARNING = 'WARNING',
}

export class CreateAuditLogDto {
    @IsString()
    action: string;

    @IsString()
    resource: string;

    @IsOptional()
    userId?: Types.ObjectId;

    @IsOptional()
    tenantId?: Types.ObjectId;

    @IsOptional()
    @IsString()
    userEmail?: string;

    @IsOptional()
    @IsString()
    userName?: string;

    @IsOptional()
    @IsString()
    ipAddress?: string;

    @IsOptional()
    @IsString()
    userAgent?: string;

    @IsOptional()
    @IsObject()
    requestBody?: any;

    @IsOptional()
    @IsObject()
    responseBody?: any;

    @IsOptional()
    @IsNumber()
    statusCode?: number;

    @IsOptional()
    @IsString()
    method?: string;

    @IsOptional()
    @IsString()
    url?: string;

    @IsOptional()
    @IsNumber()
    executionTime?: number;

    @IsOptional()
    @IsEnum(AuditStatus)
    status?: AuditStatus;

    @IsOptional()
    @IsString()
    errorMessage?: string;

    @IsOptional()
    @IsObject()
    metadata?: any;
} 