import { IsString, IsDate, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class VisitDto {
    @IsDate()
    @Type(() => Date)
    date: Date;

    @IsString()
    doctor: string;

    @IsString()
    diagnosis: string;

    @IsArray()
    @IsString({ each: true })
    prescriptions: string[];
}

export class CreatePatientDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsDate()
    @Type(() => Date)
    dateOfBirth: Date;

    @IsString()
    gender: string;

    @IsString()
    address: string;

    @IsString()
    phoneNumber: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VisitDto)
    @IsOptional()
    visits?: VisitDto[];
} 