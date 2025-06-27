import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import CredentialsDto from './dtos/credentials.dto';
import { Audit, AuditActions, AuditResources } from '../audit/decorators/audit.decorator';
import { AuditDecoratorInterceptor } from '../audit/interceptors/audit-decorator.interceptor';

@Controller('auth')
@UseInterceptors(AuditDecoratorInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @Audit({
        action: AuditActions.USER_LOGIN,
        resource: AuditResources.USERS,
        customData: (args, result) => ({
            userEmail: args[0]?.email,
            loginSuccess: !!result?.access_token,
            userId: result?.user?._id,
        }),
    })
    async login(@Body() credentials: CredentialsDto) {
        return this.authService.login(credentials);
    }
}