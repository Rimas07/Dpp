import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserContextMiddleware implements NestMiddleware {
    private readonly logger = new Logger(UserContextMiddleware.name);

    constructor(private readonly jwtService: JwtService) { }

    use(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers.authorization;

            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);

                try {
                    const decoded = this.jwtService.verify(token);

                 
                    (req as any).user = {
                        id: decoded.sub,
                        email: decoded.email,
                        name: decoded.name,
                        roles: decoded.roles,
                    };

                    // Добавляем tenantId если есть
                    if (decoded.tenantId) {
                        (req as any).tenantId = decoded.tenantId;
                    }

                    this.logger.debug(`User context set: ${decoded.email}`);
                } catch (jwtError) {
                    this.logger.warn(`Invalid JWT token: ${jwtError.message}`);
                }
            }
        } catch (error) {
            this.logger.error(`Error in UserContextMiddleware: ${error.message}`);
        }

        next();
    }
} 