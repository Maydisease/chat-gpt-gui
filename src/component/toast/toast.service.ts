import {Inject, Injectable, Injector, PLATFORM_ID} from '@angular/core';
import {Overlay, OverlayRef, ScrollStrategyOptions} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {ToastComponent, ToastContext} from './toast.component';
import {isPlatformBrowser} from '@angular/common'

export interface ContextBase {
    $m: {
        detach: (key: number) => void;
        key: number;
    }
}

@Injectable({providedIn: 'root'})
export class ToastService {

    public list = new Map<number, OverlayRef>();
    public count = 0;
    public isBrowser = false;

    constructor(
        private overlay: Overlay,
        private readonly scrollStrategyOptions: ScrollStrategyOptions,
        @Inject(PLATFORM_ID) platformId: string
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    static createInjector<T>(data: T): Injector {
        return Injector.create({providers: [{provide: 'context', useValue: data}]})
    }

    // 创建
    public create(
        message: string,
        timeout = 3000
    ): [number, OverlayRef] | void {

        if (!this.isBrowser) {
            return;
        }

        this.count++;

        const overlayRef = this.overlay.create({
            hasBackdrop: false
        });
        this.list.set(this.count, overlayRef);
        const component = ToastComponent;
        const context = {message, timeout} as ToastContext & ContextBase;
        context.$m = {
            detach: this.detach.bind(this),
            key: this.count
        }
        const portal = new ComponentPortal(component, null, ToastService.createInjector(context));
        if (portal) {
            overlayRef.attach(portal);
        }

        return [this.count, overlayRef];
    }

    // 销毁
    public detach(key: number) {
        if (this.list.has(key)) {
            this.list.get(key)!.detach();
            this.list.delete(key);
        }
    }
}
