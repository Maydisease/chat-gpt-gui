import {Directive, ElementRef, EventEmitter, HostListener, Output, ViewChild} from '@angular/core';

@Directive({
    selector: '[checkboxClickHandle]',
    exportAs: 'checkboxClickHandleRef'
})
export class CheckboxClickHandleDirective {

    public element: ElementRef;

     @Output('checkboxChange') checkboxChange = new EventEmitter();

    constructor(readonly el: ElementRef) {
        this.element = el.nativeElement;
    }

    @HostListener('click', ['$event'])
    handle() {

    }
}
