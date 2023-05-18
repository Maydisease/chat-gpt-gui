import {EventEmitter, Injectable} from '@angular/core';
import {AppService} from "../../../app/app.service";

@Injectable({providedIn: 'root'})
export class MessageCardService {

    public autoPull = false;

    public scrollToBottomEvent = new EventEmitter();

    constructor(
        public appService: AppService,
    ) {
    }

    stop() {
        this.appService.worker.postMessage({
            eventName: 'requestStop'
        })
    }

    public scrollToBottomHandle() {
        this.autoPull = true;
        this.scrollToBottomEvent.emit();
    }
}
