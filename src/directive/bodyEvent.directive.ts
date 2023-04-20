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
            const preElement = element.previousElementSibling;
            const codeElement = preElement?.querySelector('code');
            console.log('codeElement:', preElement)
            if (codeElement) {
                const prueCodeStr = this.htmlUtilService.removeHtmlTag(codeElement.outerHTML);
                console.log('prueCodeStr:', prueCodeStr)
                if (prueCodeStr) {
                    copyText(undefined, prueCodeStr)
                }
            }
        }
    }
}
