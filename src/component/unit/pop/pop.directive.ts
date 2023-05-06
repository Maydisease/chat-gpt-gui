import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {PopService} from "./pop.service";

@Directive({selector: '[pop]'})
export class PopDirective {

    @Input('pop') msg = '';

    @Output('popConfirmEvent') popConfirmEvent = new EventEmitter()
    @Output('popCancelEvent') popCancelEvent = new EventEmitter()

    constructor(
        public el: ElementRef,
        public popService: PopService,
    ) {

    }

    @HostListener('click', ['$event'])
    handle($event: MouseEvent) {
        this.popService.create(this.msg, $event.target as HTMLElement, this.popConfirmEvent, this.popCancelEvent);
    }
}
