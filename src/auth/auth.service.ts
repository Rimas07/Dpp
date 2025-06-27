import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { TenantConnectionService } from 'src/services/tenant-connection.service';
import { encrypt } from 'src/utils/encrypt';
import { Secrets, SecretsSchema } from './secrets.schema';
import CredentialsDto from './dtos/credentials.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { decrypt } from 'src/utils/decrypt';

@Injectable()
export class AuthService {
    constructor(
        private configService: ConfigService,
        private tenantConnectionService: TenantConnectionService,
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async login(credentials: CredentialsDto) {
        //Find if user exists by email
        const { email, password } = credentials;
        const user = await this.usersService.getUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Wrong credentials');
        }

        //Compare entered password with existing password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Wrong credentials');
        }

        // Generate JWT token
        const payload = {
            email: user.email,
            sub: user._id,
            tenantId: user.tenantId
        };

        const access_token = this.jwtService.sign(payload);

        // Return user info and token
        return {
            tenantId: user.tenantId,
            access_token,
            user: {
                _id: user._id,
                email: user.email,
                tenantId: user.tenantId
            }
        };
    }

    async createSecretKeyForNewTenant(tenantId: string) {
        //Generate Random Secret Key
        const jwtSecret = nanoid(128);

        const encryptionKey = this.configService.get<string>('security.encryptionSecretKey');
        if (!encryptionKey) {
            throw new Error('Encryption key is not configured');
        }

        //Encrypt the Secret Key
        const encryptedSecret = encrypt(
            jwtSecret,
            encryptionKey
        );

        //Get Access to the tenant specific Model
        const SecretsModel = await this.tenantConnectionService.getTenantModel(
            {
                name: Secrets.name,
                schema: SecretsSchema,
            },
            tenantId,
        );

        //Store the encrypted secret key
        await SecretsModel.create({ jwtSecret: encryptedSecret });
    }

    async fetchAccessTokenSecretSigningKey(tenantId: string) {
        const SecretsModel = await this.tenantConnectionService.getTenantModel(
            {
                name: Secrets.name,
                schema: SecretsSchema,
            },
            tenantId,
        );

        const secretsDoc = await SecretsModel.findOne();
        const encryptionKey = this.configService.get<string>('security.encryptionSecretKey');
        if (!encryptionKey) {
            throw new Error('Encryption key is not configured');
        }

        const secretKey = decrypt(
            secretsDoc.jwtSecret,
            encryptionKey
        );
        return secretKey;
    }
}