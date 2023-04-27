import {ChangeDetectorRef, Directive, ElementRef, NgZone, Renderer2} from '@angular/core';
import {AppService, HISTORY_LIST_ITEM_STATE, STREAM_STATE} from "../../../app/app.service";

@Directive({selector: '[new-temp]'})
export class NewTempDirective {

    constructor(
        public el: ElementRef,
        public r2: Renderer2,
        public appService: AppService,
        public ngZone: NgZone,
        public cdr: ChangeDetectorRef
    ) {

        this.appService.worker.onmessage = ({data}) => {

            if (data.eventName === 'responseChunk') {
                const {htmlChunk} = data.message;
                this.ngZone.runOutsideAngular(() => {
                    this.ngZone.run(() => {
                        document.querySelectorAll('.card-new-temp-container').forEach((element) => {
                            this.r2.setProperty(element, 'innerHTML', htmlChunk)
                        })
                    })
                });
            }
        }
    }
}
