import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {PopComponent} from "./pop.component";
import {DynamicLoadService} from "../../../services/dynamicLoad.service";

export interface PopPropsContext {
    msg: string;
    mountElement: HTMLElement;
    destroy: () => void;
    popConfirmEvent: EventEmitter<void>;
    popCancelEvent: EventEmitter<void>
}

@Injectable({providedIn: 'root'})
export class PopService {

    public lock = false;

    constructor(
        public dynamicLoad: DynamicLoadService,
    ) {
    }

    create(msg: string, mountElement: HTMLElement, popConfirmEvent: EventEmitter<void>, popCancelEvent: EventEmitter<void>) {
        if (!this.lock) {
            this.lock = true;
            this.dynamicLoad.create<PopPropsContext>(PopComponent, {
                msg,
                mountElement,
                destroy: this.destroy.bind(this),
                popConfirmEvent,
                popCancelEvent
            });
        }
    }

    destroy() {
        this.lock = false;
    }

}
