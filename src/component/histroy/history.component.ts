import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HistoryService} from "./history.service";
import {
    ASK_KEYBOARD_EVENT_NAME,
    HISTORY_KEYBOARD_EVENT_NAME,
    SendActionService
} from "../../services/sendAction.service";
import {AppService} from "../../app/app.service";
import {PlatformUtilService} from "../../utils/platform.util";

@Component({
    selector: 'history',
    templateUrl: 'history.component.html',
    styleUrls: ['./history.component.scss']
})

export class HistoryComponent implements OnInit {

    @Output('selectedEvent') selectedEvent = new EventEmitter<string>();

    constructor(
        public historyService: HistoryService,
        public sendActionService: SendActionService,
        public appService: AppService
    ) {
    }

    ngOnInit() {

        this.sendActionService.historyKeyboardEvent.subscribe((event) => {
            if (event.eventName === HISTORY_KEYBOARD_EVENT_NAME.SELECT) {
                this.historyService.move(event.value!);
            }
            if (event.eventName === HISTORY_KEYBOARD_EVENT_NAME.CONFIRM) {
                this.historyService.isOpen = false;
                this.selectedEvent.emit(this.historyService.selectedValue);
            }
        });
        this.sendActionService.askKeyboardEvent.subscribe((event) => {
            if (event.eventName === ASK_KEYBOARD_EVENT_NAME.VALUE_CHANGE) {
                setTimeout(() => {
                    if (this.appService.searchKey) {
                        this.historyService.isOpen = false;
                    }
                })
            }
        })
    }
}
