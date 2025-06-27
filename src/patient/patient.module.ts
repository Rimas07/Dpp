import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { PatientController } from "./patient.controller";
import { PatientService } from "./patient.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Patient, PatientSchema } from "./schemas/patient.schema";
import { Visit, VisitSchema } from "./schemas/visit.schema";
import { Diagnosis, DiagnosisSchema } from "./schemas/diagnosis.schema";
import { Prescription, PrescriptionSchema } from "./schemas/prescription.schema";
import { TenantsMiddleware } from "src/middlewares/tenants.middleware";
import { tenantConnectionProvider } from "src/providers/tenant.connection.provider";
import { tenantModels } from "src/providers/tenant-model-provider";
import { TenantModule } from "src/tenants/tenants.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientSchema },
      { name: Visit.name, schema: VisitSchema },
      { name: Diagnosis.name, schema: DiagnosisSchema },
      { name: Prescription.name, schema: PrescriptionSchema },
    ]),

    TenantModule,
    AuthModule
  ],
  controllers: [PatientController],
  providers: [PatientService, tenantModels.PatientModule],
  exports: [PatientService],
})
export class PatientModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(PatientController);
  }
}