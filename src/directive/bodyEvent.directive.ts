import {Directive, ElementRef, HostBinding, HostListener} from '@angular/core';
import {HtmlUtilService} from "../utils/removeHtml.util";
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
            const codeContainerElement = element.previousElementSibling;
            if (codeContainerElement?.classList.contains('code-render-container')) {
                const prueCodeStr = this.htmlUtilService.removeHtmlTag(codeContainerElement.outerHTML);
                if (prueCodeStr) {
                    copyText(undefined, prueCodeStr)
                }
            }
        }
    }
}
