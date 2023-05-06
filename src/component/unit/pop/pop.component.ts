import {Component, ElementRef, Inject, OnInit, Renderer2, ViewChild} from '@angular/core';
import {PopPropsContext} from "./pop.service";
import {ContextBase} from "../../../services/dynamicLoad.service";
import {PlatformUtilService} from "../../../utils/platform.util";

@Component({
    selector: 'pop',
    templateUrl: './pop.component.html',
    styleUrls: ['./pop.component.scss']
})

export class PopComponent implements OnInit {

    @ViewChild('popElementRef') popElementRef: ElementRef<HTMLElement> | undefined;

    public x = 0;
    public y = 0;

    public element: HTMLElement | undefined;

    constructor(
        @Inject('context') public context: ContextBase<PopPropsContext>,
        public r2: Renderer2,
        public platformUtilService: PlatformUtilService,
    ) {
        setTimeout(() => {
            this.element = this.popElementRef?.nativeElement;
            this.syncPos();
        })
    }

    syncPos() {
        requestAnimationFrame(() => {
            const {top, left, right, bottom} = this.context.$props.mountElement.getBoundingClientRect();
            const mountHeight = this.element!.clientHeight;
            this.r2.setStyle(this.element!, 'left', `${left}px`)
            this.r2.setStyle(this.element!, 'top', `${top - (mountHeight + 20)}px`)
            this.syncPos();
        });
    }

    cancel() {
        this.destroy();
        this.context.$props.popCancelEvent.emit();
    }

    confirm() {
        this.destroy();
        this.context.$props.popConfirmEvent.emit();
    }

    destroy() {
        this.context.$m?.detach(this.context.$m?.key);
        this.context.$props.destroy();
    }

    ngOnInit() {
    }
}
