import { Inject, InternalServerErrorException, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { getConnectionToken } from "@nestjs/mongoose";
import { Connection } from "mongoose";

export const tenantConnectionProvider = {
    provide: 'TENANT_CONNECTION',
    scope: Scope.REQUEST, // ✅ ADD THIS - Makes provider request-scoped
    useFactory: async (request, connection: Connection) => {
        // ✅ ADD NULL CHECK - Check if request exists first
        if (!request) {
            throw new InternalServerErrorException(
                'Request object is undefined - make sure provider is request-scoped'
            );
        }

        if (!request.tenantId) {
            throw new InternalServerErrorException(
                'make sure apply middle'
            );
        }
        return connection.useDb(`Patient_${request.tenantId}`);
    },
    inject: [REQUEST, getConnectionToken()] // ✅ FIX THIS - lowercase 'inject', not 'Inject'
};