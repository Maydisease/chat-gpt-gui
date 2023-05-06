import {Injectable} from '@angular/core';
import {AppService} from "../../../app/app.service";

@Injectable({providedIn: 'root'})
export class MessageCardService {

    constructor(
        public appService: AppService,
    ) {
    }

    stop() {
        this.appService.worker.postMessage({
            eventName: 'requestStop'
        })
    }
}
