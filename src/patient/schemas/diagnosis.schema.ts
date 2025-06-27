import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Diagnosis extends Document {
    @Prop({ required: true })
    code: string;

    @Prop({ required: true })
    name: string;

    @Prop()
    description?: string;

    @Prop()
    severity?: string;
}

export const DiagnosisSchema = SchemaFactory.createForClass(Diagnosis); 