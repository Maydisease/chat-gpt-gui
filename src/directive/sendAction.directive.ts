import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {AppService} from "../app/app.service";
import {PlatformUtilService} from "../utils/platform.util";
import {
    ASK_KEYBOARD_EVENT_NAME,
    HISTORY_KEYBOARD_EVENT_NAME,
    HISTORY_KEYBOARD_SELECT_VALUE,
    SendActionService
} from "../services/sendAction.service";

@Directive({selector: '[send-action]'})
export class SendActionDirective {

    @Output() sendActionCallback = new EventEmitter();
    @Output() focusCallback = new EventEmitter();
    @Output() blurCallback = new EventEmitter();
    @Output() keyEnterCallback = new EventEmitter();
    @Output() useHistorySearchCallback = new EventEmitter();
    @Input() isUsedHistorySearchKeying = false;

    public timer: any;

    public element: HTMLTextAreaElement | undefined;

    constructor(
        elementRef: ElementRef,
        public sendActionService: SendActionService,
        public appService: AppService,
        public platformUtilService: PlatformUtilService,
    ) {
        this.element = elementRef.nativeElement;
    }


    public isCombination(event: KeyboardEvent) {
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

        const isCombination = this.isCombination(event);
        const isEmptyValue = !this.element!.value;

        // 历史记录模式信息发送
        if (isEmptyValue) {
            // 上下选择事件
            if ((event.code === 'ArrowUp' || event.code === 'ArrowDown') && !isCombination) {
                event.stopPropagation();
                event.preventDefault();
                this.sendActionService.historyKeyboardEvent.emit({
                    eventName: HISTORY_KEYBOARD_EVENT_NAME.SELECT,
                    value: event.code === 'ArrowUp' ? HISTORY_KEYBOARD_SELECT_VALUE.PREV : HISTORY_KEYBOARD_SELECT_VALUE.NEXT
                })
            }

            // 发送事件
            if ((event.key === 'Enter') && !isCombination) {
                event.stopPropagation();
                event.preventDefault();
                this.sendActionService.historyKeyboardEvent.emit({
                    eventName: HISTORY_KEYBOARD_EVENT_NAME.CONFIRM
                })
            }
        }

        // 问答模式 - 信息发送
        if (!isEmptyValue) {
            if ((event.key === 'Enter') && isCombination) {
                event.stopPropagation();
                event.preventDefault();
                this.sendActionService.askKeyboardEvent.emit({
                    eventName: ASK_KEYBOARD_EVENT_NAME.SEND
                });
            }
        }

        this.sendActionService.askKeyboardEvent.emit({
            eventName: ASK_KEYBOARD_EVENT_NAME.VALUE_CHANGE,
        });

        if (this.platformUtilService.isBrowserMobile) {

            // if (this.element?.getBoundingClientRect().top! > window.visualViewport!.height) {
                // setTimeout(() => {
                //     console.log(999)
                //     window.scrollTo(0, window.screen.height);
                // }, 0)

                // this.element?.scrollIntoView({behavior: "smooth"});
                // console.log(3333)
            // }

            // console.log(3330, window.visualViewport!.height, this.element?.getBoundingClientRect().top, window.screen.height)


        }
    }
}
