import {Directive, ElementRef, EventEmitter, HostListener, Input, Output, SimpleChanges} from '@angular/core';
import {PopService} from "./pop.service";

@Directive({selector: '[pop]'})
export class PopDirective {

    @Input('pop') msg = '';
    @Input('disabled') disabled = false;

    @Output('popConfirmEvent') popConfirmEvent = new EventEmitter()
    @Output('popCancelEvent') popCancelEvent = new EventEmitter()

    constructor(
        public el: ElementRef,
        public popService: PopService,
    ) {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('disabled' in changes) {
            const newValue = changes['disabled'].currentValue;
            if (newValue !== this.disabled) {
                this.disabled = newValue;
            }
        }
    }

    @HostListener('click', ['$event'])
    handle($event: MouseEvent) {

        if (this.disabled) {
            $event.defaultPrevented;
            $event.stopPropagation();
            return;
        }

        this.popService.create(this.msg, $event.target as HTMLElement, this.popConfirmEvent, this.popCancelEvent);
    }
}
