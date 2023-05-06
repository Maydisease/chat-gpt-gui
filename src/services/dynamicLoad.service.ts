import {EventEmitter, Injectable, Injector} from "@angular/core";
import {
    ComponentType,
    Overlay,
    ScrollStrategy,
    ScrollStrategyOptions,
} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";
import {OverlayRef} from "@angular/cdk/overlay";

export interface ContextBase<P> {
    message?: string;
    $m?: {
        detach: (key: number) => void;
        key: number;
    };
    $props: P
}

@Injectable({providedIn: "root"})
export class DynamicLoadService {
    public scrollStrategy: ScrollStrategy;
    public overlayRefMap = new Map<number, OverlayRef>();
    public count = 0;

    constructor(
        private overlay: Overlay,
        private readonly scrollStrategyOptions: ScrollStrategyOptions
    ) {
        this.scrollStrategy = scrollStrategyOptions.block();
    }

    static createInjector<T>(data: T): Injector {
        return Injector.create({
            providers: [{provide: "context", useValue: data}],
        });
    }

    // 创建
    public create<P>(component: ComponentType<any>, props: P | undefined = undefined): [number, OverlayRef] {
        this.count++;
        const overlayRef = this.overlay.create({
            ...{
                height: "0",
                width: "0",
                hasBackdrop: false,
                backdropClass: "dynamic-backdrop",
                scrollStrategy: this.scrollStrategy,
                positionStrategy: this.overlay
                    .position()
                    .global()
                    .centerHorizontally()
                    .centerVertically(),
            },
        });

        this.overlayRefMap.set(this.count, overlayRef);
        const context: ContextBase<P | undefined> = {
            $props: props
        };
        context.$m = {
            detach: this.detach.bind(this),
            key: this.count,
        };
        const portal = new ComponentPortal(
            component,
            null,
            DynamicLoadService.createInjector(context)
        );

        if (portal) {
            overlayRef.attach(portal);
        }

        return [this.count, overlayRef];
    }

    // 销毁
    public detach(key: number) {
        if (this.overlayRefMap.has(key)) {
            this.overlayRefMap.get(key)!.detach();
            this.overlayRefMap.delete(key);
        }
    }
}
