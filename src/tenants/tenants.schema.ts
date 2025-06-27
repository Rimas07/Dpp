import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'tenants' }) // Явное указание имени коллекции
export class Tenant extends Document {


  @Prop({ required: true, unique: true })
  tenantId: string;

  @Prop({ required: true }) // Добавлено новое обязательное поле
  companyName: string;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);