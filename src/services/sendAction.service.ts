import {EventEmitter, Injectable} from '@angular/core';

export enum HISTORY_KEYBOARD_EVENT_NAME {
    SELECT,
    CONFIRM,
}

export enum HISTORY_KEYBOARD_SELECT_VALUE {
    PREV,
    NEXT
}

export enum ASK_KEYBOARD_EVENT_NAME {
    SEND,
    VALUE_CHANGE
}

interface HistoryReturn {
    eventName: HISTORY_KEYBOARD_EVENT_NAME;
    value?: HISTORY_KEYBOARD_SELECT_VALUE
}

interface AskReturn {
    eventName: ASK_KEYBOARD_EVENT_NAME;
}

@Injectable({providedIn: 'root'})
export class SendActionService {

    public historyKeyboardEvent = new EventEmitter<HistoryReturn>();
    public askKeyboardEvent = new EventEmitter<AskReturn>();

    constructor() {
    }
}
