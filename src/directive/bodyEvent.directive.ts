import {Directive, ElementRef, HostBinding, HostListener} from '@angular/core';
import {HtmlUtilService} from "../utils/html.util";
import {copyText} from "../libs/copy.util";

@Directive({selector: '[top-container-event]'})
export class BodyEventDirective {
    constructor(el: ElementRef, public htmlUtilService: HtmlUtilService) {
        console.log('el', el)
    }

    @HostListener('click', ['$event'])
    handle($event: MouseEvent) {
        const element = $event.target as HTMLElement;
        if (element.classList.contains('code-render-copy')) {
            const nextElement = element.nextElementSibling;
            if (nextElement?.classList.contains('value') && nextElement!.tagName === 'CODE') {
                console.log('nextElement.textContent!:', nextElement.textContent!)
                copyText(undefined, nextElement.textContent!)
            }
        }
    }
}
