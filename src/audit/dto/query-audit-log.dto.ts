import { IsOptional, IsString, IsEnum, IsDateString, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class QueryAuditLogDto {
    @IsOptional()
    @IsString()
    action?: string;

    @IsOptional()
    @IsString()
    resource?: string;

    @IsOptional()
    @Transform(({ value }) => new Types.ObjectId(value))
    userId?: Types.ObjectId;

    @IsOptional()
    @Transform(({ value }) => new Types.ObjectId(value))
    tenantId?: Types.ObjectId;

    @IsOptional()
    @IsString()
    userEmail?: string;

    @IsOptional()
    @IsString()
    ipAddress?: string;

    @IsOptional()
    @IsEnum(['SUCCESS', 'ERROR', 'WARNING'])
    status?: string;

    @IsOptional()
    @IsString()
    method?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(100)
    @Transform(({ value }) => parseInt(value))
    limit?: number = 20;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Transform(({ value }) => parseInt(value))
    offset?: number = 0;

    @IsOptional()
    @IsString()
    sortBy?: string = 'createdAt';

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => value === 'asc' ? 1 : -1)
    sortOrder?: number = -1;
} 