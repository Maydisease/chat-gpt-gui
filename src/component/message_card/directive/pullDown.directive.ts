import {Directive, ElementRef} from '@angular/core';
import {AppService} from "../../../app/app.service";
import {scrollSmoothTo} from "../../../utils/scrollToView.util";
import {PlatformUtilService} from "../../../utils/platform.util";

@Directive({selector: '[pull-down]'})
export class PullDownDirective {

    getNearestScrollContainer(element: HTMLElement) {
        let container: HTMLElement = element.offsetParent as HTMLElement;
        while (container) {
            if (container.scrollHeight > container.clientHeight ||
                container.scrollWidth > container.clientWidth) {
                return container;
            }
            container = container.offsetParent as HTMLElement;
        }
        return null;
    }

    constructor(public el: ElementRef, public appService: AppService, public platformUtilService: PlatformUtilService) {
        this.appService.askSendResultEvent.subscribe(() => {
            const element = this.el.nativeElement as HTMLDivElement;
            setTimeout(() => {
                scrollSmoothTo(undefined, this.getNearestScrollContainer(element)!, element, 0);
            })
        })
    }
}
