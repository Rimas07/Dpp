import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Patient } from './schemas/patient.schema';
import { Request } from 'express';
import { TenantAuthenticationGuard } from 'src/guards/tenant-auth.guard';
import { Audit, AuditActions, AuditResources } from '../audit/decorators/audit.decorator';
import { AuditDecoratorInterceptor } from '../audit/interceptors/audit-decorator.interceptor';

@Controller('patients')
@UseGuards(TenantAuthenticationGuard)
@UseInterceptors(AuditDecoratorInterceptor)
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
  ) { }

  @Get()
  @Audit({
    action: AuditActions.PATIENT_SEARCH,
    resource: AuditResources.PATIENTS,
  })
  async getPatients(@Req() req: Request) {
    const tenantId = req['tenantId']; // Получаем из middleware
    return this.patientService.getPatients(tenantId);
  }

  @Post()
  @Audit({
    action: AuditActions.PATIENT_CREATE,
    resource: AuditResources.PATIENTS,
    customData: (args, result) => ({
      patientId: result?._id,
      patientName: args[1]?.name,
    }),
  })
  async createPatient(
    @Req() req: Request,
    @Body() patientData: any
  ) {
    const tenantId = req['tenantId'];
    return this.patientService.createPatient(tenantId, patientData);
  }

  @Get(':id')
  @Audit({
    action: AuditActions.PATIENT_READ,
    resource: AuditResources.PATIENTS,
    customData: (args) => ({
      patientId: args[0],
    }),
  })
  findOne(@Param('id') id: string): Promise<Patient> {
    return this.patientService.findOne(id);
  }

  @Patch(':id')
  @Audit({
    action: AuditActions.PATIENT_UPDATE,
    resource: AuditResources.PATIENTS,
    customData: (args, result) => ({
      patientId: args[0],
      updatedFields: Object.keys(args[1] || {}),
      patientName: result?.name,
    }),
  })
  update(
    @Param('id') id: string,
    @Body() updatePatientDto: Partial<CreatePatientDto>,
  ): Promise<Patient> {
    return this.patientService.update(id, updatePatientDto);
  }

  @Delete(':id')
  @Audit({
    action: AuditActions.PATIENT_DELETE,
    resource: AuditResources.PATIENTS,
    customData: (args, result) => ({
      patientId: args[0],
      patientName: result?.name,
    }),
  })
  remove(@Param('id') id: string): Promise<Patient> {
    return this.patientService.remove(id);
  }
}