import {AfterViewInit, Directive, ElementRef, Renderer2} from '@angular/core';

@Directive({selector: '[hljs-render]'})
export class HljsDirective implements AfterViewInit {
    constructor(public el: ElementRef, public renderer: Renderer2) {
        console.log(666)
    }

    ngAfterViewInit() {
        const element = this.el.nativeElement as HTMLElement;
        console.log('element:', 555, element)
        element.querySelectorAll('pre').forEach((element) => {
            console.log(2737)
        })
    }
}
