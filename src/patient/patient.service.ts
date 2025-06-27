import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Patient, PatientSchema } from './schemas/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientService {
  update(id: string, updatePatientDto: Partial<CreatePatientDto>): Promise<Patient> {
    throw new Error('Method not implemented.');
  }
  remove(id: string): Promise<Patient> {
    throw new Error('Method not implemented.');
  }
  findOne(id: string): Promise<Patient> {
    throw new Error('Method not implemented.');
  }
  private tenantModels: Map<string, Model<Patient>> = new Map();

  constructor(
    @InjectConnection() private readonly connection: Connection
  ) { }

  
  private async getTenantModel(tenantId: string): Promise<Model<Patient>> {
    
    const cachedModel = this.tenantModels.get(tenantId);
    if (cachedModel) {
      return cachedModel;
    }

    // Создаем новое подключение к базе тенанта
    const tenantDb = this.connection.useDb(`Patient_${tenantId}`, {
      useCache: true,
    });

  
    const model = tenantDb.model<Patient>(
      'Patient',
      PatientSchema,
      'patients'
    ) as Model<Patient>; 

    // Кэшируем модель
    this.tenantModels.set(tenantId, model);
    return model;
  }

  async createPatient(tenantId: string, patientData: any) {
    try {
      console.log(`Service: Creating patient for tenant: ${tenantId}`);
      const model = await this.getTenantModel(tenantId);
      const newPatient = new model(patientData);
      return await newPatient.save();
    } catch (error) {
      console.error('Error creating patient:', error);
      throw new NotFoundException(`Failed to create patient for tenant ${tenantId}`);
    }
  }

  
  async getAllPatients(tenantId: string) {
    try {
      console.log(`Service: Getting patients for tenant: ${tenantId}`);
      const model = await this.getTenantModel(tenantId);
      return await model.find().exec();
    } catch (error) {
      console.error('Error getting patients:', error);
      throw new NotFoundException(`Patients not found for tenant ${tenantId}`);
    }
  }

  
  async getPatients(tenantId: string) {
    return this.getAllPatients(tenantId);
  }
}