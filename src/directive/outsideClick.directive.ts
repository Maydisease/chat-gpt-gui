import {Directive, ElementRef, EventEmitter, OnDestroy, Output, Renderer2} from '@angular/core';

@Directive({selector: '[outsideClick]'})
export class OutsideClickDirective implements OnDestroy{

    public element: HTMLElement | undefined;

    @Output('outsideClick') outsideClick = new EventEmitter();

    constructor(public elementRef: ElementRef, public r2: Renderer2) {
        this.element = elementRef.nativeElement;
        this.r2.listen(document, 'click', this.handleClick);
        this.r2.listen(this.element!, 'click', this.elementHandleClick);
    }

    elementHandleClick = (event: MouseEvent) => {
        event.stopPropagation();
    }

    handleClick = (event: MouseEvent) => {
        if (!this.element!.contains(event.target as Node)) {
            this.outsideClick.emit();
        }
    };

    ngOnDestroy() {
        document.removeEventListener('click', this.handleClick);
        this.element!.removeEventListener('click', this.elementHandleClick);
    }
}
