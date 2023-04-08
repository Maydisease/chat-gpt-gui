import {Pipe, PipeTransform} from '@angular/core';
import {md5} from '../libs/md5';

@Pipe({name: 'md5'})
export class Md5Pipe implements PipeTransform {
  transform(value: string): string {
    return md5(value)
  }
}
