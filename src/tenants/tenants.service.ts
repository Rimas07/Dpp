import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant } from './tenants.schema';
import { CreateTenantDto } from './create-tenant.dto'; // Добавьте DTO
import CreateCompanyDto from './create-company.dto';
import { UsersService } from 'src/users/users.service';
import { nanoid } from 'nanoid';
import { AuthService } from 'src/auth/auth.service';


@Injectable()
export class TenantService {
  constructor(
    @InjectModel(Tenant.name)
    private TenantModel: Model<Tenant>,
    private usersService: UsersService,
    private authService: AuthService
  ) { }



  async getTenantById(tenantId: string) {
    return this.TenantModel.findOne({ tenantId }).exec();
  }


  async createCompany(companyData: CreateCompanyDto) {
    const user = await this.usersService.getUserByEmail(companyData.user.email)
    if (user) {
      throw new BadRequestException('User belongs to another company.....')// veryvift if usef exists

    }
    // creating tenant idd
    const tenantId = nanoid(12)



    // create a tenant secret
    await this.authService.createSecretKeyForNewTenant(tenantId)



    await this.usersService.createUser(companyData.user, tenantId)// this method creates new user


    /// creates tenant record
    return this.TenantModel.create({
      companyName: companyData.companyName,
      tenantId,
    })
  }
}





















// @Injectable()
// export class TenantService {
//   createCompany(createCompanyDto: CreateCompanyDto): Tenant | PromiseLike<Tenant> {
//       throw new Error('Method not implemented.');
//   }
//   constructor(
//     @InjectModel(Tenant.name)
//     private tenantModel: Model<Tenant>
//   ) { }

//   async createTenant(createTenantDto: CreateTenantDto): Promise<Tenant> {
//     const newTenant = new this.tenantModel(createTenantDto);
//     return newTenant.save();
//   }

//   async getTenantById(tenantId: string): Promise<Tenant | null> {
//     return this.tenantModel.findOne({ tenantId }).exec();
//   }

//   async getAllTenants(): Promise<Tenant[]> {
//     return this.tenantModel.find().exec();
//   }
// }