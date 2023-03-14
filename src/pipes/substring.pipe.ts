import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'substring'})
export class SubstringPipe implements PipeTransform {
  transform(value: string, len = 10): string {
    return value.length > len ? `${value}`.substring(0, len) + '...' : value;
  }
}
