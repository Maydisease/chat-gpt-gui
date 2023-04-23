import {Directive, ElementRef} from '@angular/core';
import {AppService} from "../../../app/app.service";
import {scrollSmoothTo} from "../../../utils/scrollToView.util";
import {PlatformUtilService} from "../../../utils/platform.util";

@Directive({selector: '[pull-down]'})
export class PullDownDirective {
    constructor(public el: ElementRef, public appService: AppService, public platformUtilService: PlatformUtilService) {
        this.appService.askSendResultEvent.subscribe(() => {
            const element = this.el.nativeElement as HTMLDivElement;
            if (!this.platformUtilService.isPC) {
                scrollSmoothTo(undefined, element.parentElement!, element, -500);
            }
        })
    }
}
