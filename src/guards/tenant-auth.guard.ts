import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    Logger,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';


@Injectable()
export class TenantAuthenticationGuard implements CanActivate {
    private readonly logger = new Logger(TenantAuthenticationGuard.name);

    constructor(
        private jwtService: JwtService,
        private authService: AuthService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

     
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            this.logger.warn('Missing access token');
            throw new UnauthorizedException('Missing access token');
        }

        try {
            const payload = await this.jwtService.verify(token);

         
            if (!payload.tenantId) {
                this.logger.warn('Token missing tenantId');
                throw new UnauthorizedException('Invalid token: missing tenantId');
            }

            
            request.tenantId = payload.tenantId;

           
            request.userInfo = {
                id: payload.sub,
                email: payload.email,
                tenantId: payload.tenantId,
            };

            this.logger.debug(`Authentication successful for user: ${payload.email}, tenant: ${payload.tenantId}`);
            return true;
        } catch (error) {
            this.logger.warn(`Token verification failed: ${error.message}`);
            throw new UnauthorizedException('Invalid token');
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        return undefined;
    }
}