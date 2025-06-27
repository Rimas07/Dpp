/* eslint-disable prettier/prettier */
 
 
 
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { error } from "console";
import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "rxjs";
import { TenantService } from "src/tenants/tenants.service";

@Injectable()
export class TenantsMiddleware implements NestMiddleware{
 
    constructor(private tenantsService:TenantService) {}
    // eslint-disable-next-line @typescript-eslint/require-await
    async use(req: Request, res: Response, next: NextFunction) {
      //check if tenant exists
      const tenantId = req.headers['x-tenant-id']?.toString();
      if (!tenantId) {
        throw new BadRequestException('X-TENANT-ID is not provided');
      }


      // const tenantExists = await this.tenantsService.getTenantById(tenantId)
      // if (!tenantExists) {
      //   throw new NotFoundException('tenant does not exist')// это делает так чтобы проверяли если существует и не добаавлялась в моенго хуйня когда пишешь типа аываываыа пока не испольхоавть
      // }
      console.log(tenantId);
      req['tenantId'] = tenantId;
      next();
    }
}