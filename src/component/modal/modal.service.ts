import {EventEmitter, Injectable, Injector} from "@angular/core";
import {
  Overlay,
  ScrollStrategy,
  ScrollStrategyOptions,
} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";
import {OverlayRef} from "@angular/cdk/overlay";
import {OverlayConfig} from "@angular/cdk/overlay";
import {ModalComponent} from "./modal.component";

export interface ModalContextBase {
  message?: string;
  $m?: {
    detach: (key: number) => void;
    key: number;
  };
  $event: Config
}

interface Config {
  cancelText?: string,
  cancel?: () => void
  confirmText?: string,
  confirm?: () => void
}

@Injectable({providedIn: "root"})
export class ModalService {
  public scrollStrategy: ScrollStrategy;
  public list = new Map<number, OverlayRef>();
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
  public create(message: string, config: Config = {}): [number, OverlayRef] {
    this.count++;
    const overlayRef = this.overlay.create({
      ...{
        height: "0",
        width: "0",
        hasBackdrop: true,
        backdropClass: "modal-backdrop",
        scrollStrategy: this.scrollStrategy,
        positionStrategy: this.overlay
          .position()
          .global()
          .centerHorizontally()
          .centerVertically(),
      },
    });

    this.list.set(this.count, overlayRef);
    const component = ModalComponent;
    const context: ModalContextBase = {
      message,
      $event: {
        cancelText: config.cancelText,
        cancel: config.cancel,
        confirm: config.confirm,
        confirmText: config.confirmText
      }
    };
    context.$m = {
      detach: this.detach.bind(this),
      key: this.count,
    };
    const portal = new ComponentPortal(
      component,
      null,
      ModalService.createInjector(context)
    );

    if (portal) {
      overlayRef.attach(portal);
    }

    return [this.count, overlayRef];
  }

  public getAll() {
    return this.list;
  }

  // 销毁
  public detach(key: number) {
    if (this.list.has(key)) {
      this.list.get(key)!.detach();
      this.list.delete(key);
    }
  }
}
