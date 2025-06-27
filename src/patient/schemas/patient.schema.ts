import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PatientDocument = Patient & Document;

@Schema()
export class Visit {
    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    doctor: string;

    @Prop({ required: true })
    diagnosis: string;

    @Prop({ type: [String], required: true })
    prescriptions: string[];
}

@Schema()
export class Patient {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    dateOfBirth: Date;

    @Prop({ required: true })
    gender: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    phoneNumber: string;

    @Prop({ type: [Visit], default: [] })
    visits: Visit[];
}

export const PatientSchema = SchemaFactory.createForClass(Patient); 