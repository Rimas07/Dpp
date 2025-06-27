import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Diagnosis } from './diagnosis.schema';
import { Prescription } from './prescription.schema';

@Schema()
export class Visit extends Document {
    @Prop({ required: true, type: Date })
    date: Date;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Diagnosis', required: true })
    diagnosis: Diagnosis;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Prescription' }] })
    prescriptions: Prescription[];

    @Prop()
    notes?: string;

    @Prop()
    doctor?: string;

    @Prop()
    department?: string;
}

export const VisitSchema = SchemaFactory.createForClass(Visit); 