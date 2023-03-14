import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {AppService} from "./app.service";

@Directive({selector: '[send-action]'})
export class SendActionDirective {

    @Output() sendActionCallback = new EventEmitter();
    @Output() focusCallback = new EventEmitter();
    @Output() blurCallback = new EventEmitter();
    @Output() keyEnterCallback = new EventEmitter();
    @Output() useHistorySearchCallback = new EventEmitter();
    @Input() isUsedHistorySearchKeying = false;

    public timer: any;

    constructor(
        ele: ElementRef,
        public appService: AppService
    ) {
    }


    public isKeyCombinationCheck(event: KeyboardEvent) {
        return event.ctrlKey || event.altKey || event.shiftKey || event.metaKey;
    }

    @HostListener('focus', ['$event'])
    onFocus(event: KeyboardEvent) {
        this.focusCallback.emit();
    }

    @HostListener('blur', ['$event'])
    onBlur(event: KeyboardEvent) {
        this.blurCallback.emit();
    }

    @HostListener('keydown', ['$event'])
    onKeydown(event: KeyboardEvent) {
        const isNotUsedKeyCombination = !this.isKeyCombinationCheck(event);
        if (event.key === 'Enter' && isNotUsedKeyCombination && this.appService.isOpenHistorySearchListPanel) {
            this.keyEnterCallback.emit();
            event.stopPropagation();
            event.preventDefault();
            return;
        }

        if ((event.code === 'ArrowUp' || event.code === 'ArrowDown') && isNotUsedKeyCombination) {
            this.useHistorySearchCallback.emit(event.code);
            if (this.isUsedHistorySearchKeying) {
                event.stopPropagation();
                event.preventDefault();
                return;
            }
        }
    }

    @HostListener('keypress', ['$event'])
    onkeyupHandle(event: KeyboardEvent) {

        if (event.metaKey && event.key === 'Enter') {
            this.timer && clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.sendActionCallback.emit();
            }, 200)
        }
    }
}
