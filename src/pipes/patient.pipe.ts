/* eslint-disable prettier/prettier */
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PatientPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(value);
    console.log(metadata);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  }
}
