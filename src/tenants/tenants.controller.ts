import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TenantService } from './tenants.service';
import { Tenant } from './tenants.schema';
import { CreateTenantDto } from './create-tenant.dto'; // Добавьте DTO
import CreateCompanyDto from './create-company.dto';

@Controller('tenants')
export class TenantController {
    constructor(private readonly tenantService: TenantService) { }

    @Post('create-company')
    async createCompany(@Body() createCompanyDto: CreateCompanyDto): Promise<Tenant> {
        return this.tenantService.createCompany(createCompanyDto);
    }

    // @Get()
    // async findAll(): Promise<Tenant[]> {
    //     return this.tenantService.getAllTenants();
    // }

    // @Get(':id')
    // async findById(@Param('id') tenantId: string): Promise<Tenant | null> {
    //     return this.tenantService.getTenantById(tenantId);
    // }
}