/* eslint-disable prettier/prettier */
import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Tenant, TenantSchema } from "./tenants.schema";
import { TenantService } from "./tenants.service";
import { tenantConnectionProvider } from "src/providers/tenant.connection.provider";
import { TenantController } from "./tenants.controller";
import { UsersModule } from "src/users/users.module";
import { AuthModule } from "src/auth/auth.module";


@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
    UsersModule, // Import this if TenantService uses UsersService
    AuthModule,
  ],
  controllers: [TenantController],
  providers: [TenantService, tenantConnectionProvider],
  exports:[TenantService, tenantConnectionProvider]
})
export class TenantModule {}