import {ChangeDetectorRef, Directive, ElementRef, NgZone, OnDestroy, Renderer2} from '@angular/core';
import {AppService} from "../../../../app/app.service";

@Directive({selector: '[new-temp]'})
export class NewTempDirective implements OnDestroy {

    constructor(
        public el: ElementRef,
        public r2: Renderer2,
        public appService: AppService,
        public ngZone: NgZone,
        public cdr: ChangeDetectorRef
    ) {
        this.appService.worker.removeEventListener('message', this.handle);
        this.appService.worker.addEventListener('message', this.handle)
    }

    public count = 0;

    handle = ({data}: any) => {
        if (data.eventName === 'responseChunk') {
            this.count++;
            const {htmlChunk} = data.message;
            this.ngZone.runOutsideAngular(() => {
                document.querySelectorAll('.card-new-temp-container').forEach((element) => {
                    element.innerHTML = htmlChunk;
                })
            });
        }
    }

    ngOnDestroy() {
        this.appService.worker.removeEventListener('message', this.handle);
    }
}
