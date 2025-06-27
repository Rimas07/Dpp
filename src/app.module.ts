/* eslint-disable prettier/prettier */
import { Logger, Module, NestModule, MiddlewareConsumer, ExecutionContext } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TenantModule } from './tenants/tenants.module';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config/config';
import { PatientModule } from './patient/patient.module';
import { JwtModule } from '@nestjs/jwt';
import { AuditModule } from './audit/audit.module';
import { UserContextMiddleware } from './audit/middleware/user-context.middleware';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';



@Module({
  imports: [

    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [config],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
      global: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 5,
    }]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('database.connectionString');
        console.log('Database URI:', uri ? 'Loaded' : 'Not found');
        return {
          uri: uri || 'mongodb://localhost:27017/defaultdb',
        };
      },
      inject: [ConfigService],
    }),
    TenantModule,
    PatientModule,
    AuditModule,
    UsersModule,
    AuthModule,


  ],
  controllers: [],
 
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserContextMiddleware)
      .forRoutes('*');
  }
}
