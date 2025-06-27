import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTenantDto {
    @IsString()
    @IsNotEmpty()
    tenantId: string;

    @IsString()
    @IsNotEmpty()
    companyName: string;

    @IsString()
    facility?: string;
}