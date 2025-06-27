import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Prescription extends Document {
    @Prop({ required: true })
    drug: string;

    @Prop({ required: true })
    dosage: string;

    @Prop()
    frequency?: string;

    @Prop()
    duration?: string;

    @Prop()
    notes?: string;
}

export const PrescriptionSchema = SchemaFactory.createForClass(Prescription); 