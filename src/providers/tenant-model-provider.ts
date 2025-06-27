import { Inject, InternalServerErrorException, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { getConnectionToken } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { PatientModule } from "src/patient/patient.module";
import { Patient, PatientSchema } from "src/patient/patient.schema";

export const tenantModels = {
    
    
    PatientModule: {
    provide: 'PATIENT_MODEL',
        useFactory: async (tenantConnection: Connection) => {
            return tenantConnection.model(
                Patient.name,
                PatientSchema,
            );



 },
        inject: ["TENANT_CONNECTION"],
    }

}





    // scope: Scope.REQUEST, // ✅ ADD THIS - Makes provider request-scoped
    // useFactory: async (request, connection: Connection) => {
    //     // ✅ ADD NULL CHECK - Check if request exists first
    //     if (!request) {
    //         throw new InternalServerErrorException(
    //             'Request object is undefined - make sure provider is request-scoped'
    //         );
    //     }

    //     if (!request.tenantId) {
    //         throw new InternalServerErrorException(
    //             'make sure apply middle'
    //         );
    //     }
    //     return connection.useDb(`Patient_${request.tenantId}`);
    // },
    // inject: [REQUEST, getConnectionToken()]