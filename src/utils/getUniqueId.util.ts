import {Injectable} from '@angular/core';
import {md5} from '../libs/md5';
import * as uuid from 'uuid';

@Injectable({providedIn: 'root'})
export class GetUniqueIdUtil {

    constructor() {
    }

    get() {
        return (md5(uuid.v4()) as string).substring(0, 8);
    }
}
