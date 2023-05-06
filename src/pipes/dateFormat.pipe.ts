import {Pipe, PipeTransform} from '@angular/core';
import {format, formatDistance} from 'date-fns'


@Pipe({name: 'dateFormat'})
export class DateFormatPipe implements PipeTransform {

    transform(value: number, t = 'yyyy-MM-dd HH:mm:ss'): string {

        let result = '';

        if (t === 'happy') {
            result = format(value, 'MM-dd HH:mm:ss')
        } else {
            result = format(value, 'MM-dd HH:mm:ss')
        }

        return result;
    }
}
