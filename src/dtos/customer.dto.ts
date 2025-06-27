/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt, IsString } from 'class-validator';

/* eslint-disable prettier/prettier */
export class PatientDto {
    @IsString()
    name: string;
    @IsInt()
    age: number;
}