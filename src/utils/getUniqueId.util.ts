import {Injectable} from '@angular/core';
import {md5} from '../libs/md5';
import * as uuid from 'uuid';

export const uniqueId = () => {
    return (md5(uuid.v4()) as string).substring(0, 8);
}

@Injectable({providedIn: 'root'})
export class GetUniqueIdUtil {

    constructor() {
    }

    get() {
        return uniqueId();
    }
}
