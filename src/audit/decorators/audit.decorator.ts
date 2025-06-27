import { SetMetadata } from '@nestjs/common';

export const AUDIT_METADATA_KEY = 'audit';

export interface AuditOptions {
    action: string;
    resource: string;
    skip?: boolean;
    customData?: (args: any[], result: any) => any;
}

export const Audit = (options: AuditOptions) => SetMetadata(AUDIT_METADATA_KEY, options);


export const AuditActions = {
   
    USER_LOGIN: 'USER_LOGIN',
    USER_LOGOUT: 'USER_LOGOUT',
    USER_REGISTER: 'USER_REGISTER',
    USER_UPDATE_PROFILE: 'USER_UPDATE_PROFILE',
    USER_CHANGE_PASSWORD: 'USER_CHANGE_PASSWORD',
    USER_DELETE: 'USER_DELETE',

    PATIENT_CREATE: 'PATIENT_CREATE',
    PATIENT_READ: 'PATIENT_READ',
    PATIENT_UPDATE: 'PATIENT_UPDATE',
    PATIENT_DELETE: 'PATIENT_DELETE',
    PATIENT_SEARCH: 'PATIENT_SEARCH',

  
    TENANT_CREATE: 'TENANT_CREATE',
    TENANT_UPDATE: 'TENANT_UPDATE',
    TENANT_DELETE: 'TENANT_DELETE',
    TENANT_READ: 'TENANT_READ',

   
    SYSTEM_BACKUP: 'SYSTEM_BACKUP',
    SYSTEM_RESTORE: 'SYSTEM_RESTORE',
    SYSTEM_CONFIG_UPDATE: 'SYSTEM_CONFIG_UPDATE',

   
    PERMISSION_GRANT: 'PERMISSION_GRANT',
    PERMISSION_REVOKE: 'PERMISSION_REVOKE',
    ROLE_ASSIGN: 'ROLE_ASSIGN',
    ROLE_REMOVE: 'ROLE_REMOVE',

  
    FILE_UPLOAD: 'FILE_UPLOAD',
    FILE_DOWNLOAD: 'FILE_DOWNLOAD',
    FILE_DELETE: 'FILE_DELETE',

 
    DATA_EXPORT: 'DATA_EXPORT',
    DATA_IMPORT: 'DATA_IMPORT',

   
    AUDIT_LOG_VIEW: 'AUDIT_LOG_VIEW',
    AUDIT_LOG_EXPORT: 'AUDIT_LOG_EXPORT',
} as const;


export const AuditResources = {
    USERS: 'users',
    PATIENTS: 'patients',
    TENANTS: 'tenants',
    SYSTEM: 'system',
    SECURITY: 'security',
    FILES: 'files',
    AUDIT_LOGS: 'audit_logs',
    REPORTS: 'reports',
} as const; 