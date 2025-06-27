import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
import { CreateAuditLogDto, AuditStatus } from './dto/create-audit-log.dto';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';

@Injectable()
export class AuditService {
    private readonly logger = new Logger(AuditService.name);

    constructor(
        @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
    ) { }

    async createAuditLog(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
        try {
            const auditLog = new this.auditLogModel(createAuditLogDto);
            const savedLog = await auditLog.save();

            this.logger.log(`Audit log created: ${savedLog.action} on ${savedLog.resource}`);
            return savedLog;
        } catch (error) {
            this.logger.error(`Failed to create audit log: ${error.message}`);
            throw error;
        }
    }

    async findAll(queryDto: QueryAuditLogDto) {
        const {
            action,
            resource,
            userId,
            tenantId,
            userEmail,
            ipAddress,
            status,
            method,
            startDate,
            endDate,
            limit = 20,
            offset = 0,
            sortBy = 'createdAt',
            sortOrder = -1,
        } = queryDto;

        const filter: any = {};

        if (action) filter.action = { $regex: action, $options: 'i' };
        if (resource) filter.resource = { $regex: resource, $options: 'i' };
        if (userId) filter.userId = userId;
        if (tenantId) filter.tenantId = tenantId;
        if (userEmail) filter.userEmail = { $regex: userEmail, $options: 'i' };
        if (ipAddress) filter.ipAddress = ipAddress;
        if (status) filter.status = status;
        if (method) filter.method = method;

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const sort: any = { [sortBy as string]: sortOrder };

        const [logs, total] = await Promise.all([
            this.auditLogModel
                .find(filter)
                .sort(sort)
                .skip(offset)
                .limit(limit)
                .populate('userId', 'email name')
                .populate('tenantId', 'name')
                .exec(),
            this.auditLogModel.countDocuments(filter),
        ]);

        return {
            logs,
            total,
            limit,
            offset,
            hasMore: offset + limit < total,
        };
    }

    async findById(id: string): Promise<AuditLog | null> {
        return this.auditLogModel
            .findById(id)
            .populate('userId', 'email name')
            .populate('tenantId', 'name')
            .exec();
    }

    async findByUserId(userId: string, limit: number = 50): Promise<AuditLog[]> {
        return this.auditLogModel
            .find({ userId: new Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('tenantId', 'name')
            .exec();
    }

    async findByTenantId(tenantId: string, limit: number = 50): Promise<AuditLog[]> {
        return this.auditLogModel
            .find({ tenantId: new Types.ObjectId(tenantId) })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('userId', 'email name')
            .exec();
    }

    async getAuditStats(tenantId?: string, startDate?: Date, endDate?: Date) {
        const matchStage: any = {};

        if (tenantId) matchStage.tenantId = new Types.ObjectId(tenantId);
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = startDate;
            if (endDate) matchStage.createdAt.$lte = endDate;
        }

        const stats = await this.auditLogModel.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        action: '$action',
                        status: '$status',
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: '$_id.action',
                    statuses: {
                        $push: {
                            status: '$_id.status',
                            count: '$count',
                        },
                    },
                    totalCount: { $sum: '$count' },
                },
            },
        ]);

        return stats;
    }

    async logUserAction(
        action: string,
        resource: string,
        userId?: Types.ObjectId,
        tenantId?: Types.ObjectId,
        metadata?: any,
    ): Promise<AuditLog> {
        return this.createAuditLog({
            action,
            resource,
            userId,
            tenantId,
            status: AuditStatus.SUCCESS,
            metadata,
        });
    }

    async logError(
        action: string,
        resource: string,
        errorMessage: string,
        userId?: Types.ObjectId,
        tenantId?: Types.ObjectId,
        metadata?: any,
    ): Promise<AuditLog> {
        return this.createAuditLog({
            action,
            resource,
            userId,
            tenantId,
            status: AuditStatus.ERROR,
            errorMessage,
            metadata,
        });
    }

    async cleanupOldLogs(daysToKeep: number = 90): Promise<number> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        const result = await this.auditLogModel.deleteMany({
            createdAt: { $lt: cutoffDate },
        });

        this.logger.log(`Cleaned up ${result.deletedCount} old audit logs`);
        return result.deletedCount;
    }
} 