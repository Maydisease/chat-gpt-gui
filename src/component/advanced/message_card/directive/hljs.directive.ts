import {AfterViewInit, Directive, ElementRef, Renderer2} from '@angular/core';

@Directive({selector: '[hljs-render]'})
export class HljsDirective implements AfterViewInit {
    constructor(public el: ElementRef, public renderer: Renderer2) {
    }

    ngAfterViewInit() {

    }
}
