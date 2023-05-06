import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { AppService, STREAM_STATE } from "../../../../app/app.service";
import { PlatformUtilService } from "../../../../utils/platform.util";
import { AsDirective} from "../../../../directive/as.directive";

@Directive({ selector: '[pull-down]' })
export class PullDownDirective {

  public timer: any;
  public prevScrollTop: number | undefined;
  public lock = false;
  public isListen = false;
  @Input('pull-down') container!: AsDirective

  public createPullAction(element: HTMLElement, contaienr: HTMLElement) {
    this.stopPullEvent();

    this.timer = setInterval(() => {

      if (this.lock) {
        return;
      }

      element.scrollIntoView({ behavior: "smooth" });
      if (this.appService.newTempDataAppEndState !== STREAM_STATE.APPENDING) {
        this.stopPullEvent();
        contaienr.removeEventListener('scroll', this.scrollHandle)
      }
    }, 1000);
  }

  public stopPullEvent() {
    clearInterval(this.timer);
  }

  public scrollHandle = (event: Event) => {
    const targetElement = event.target as HTMLElement;

    if (this.prevScrollTop !== undefined && this.prevScrollTop > targetElement.scrollTop) {
      this.lock = true;
    }

    this.prevScrollTop = targetElement.scrollTop;
  }

  public listenScrollContainer(container: HTMLElement) {

    if (!this.isListen) {
      this.isListen = true;
      this.r2.listen(container, 'scroll', this.scrollHandle)
    }
  }

  constructor(
    public el: ElementRef,
    public appService: AppService,
    public platformUtilService: PlatformUtilService,
    public r2: Renderer2
  ) {
    this.appService.askSendResultEvent.subscribe(() => {
      const element = this.el.nativeElement as HTMLDivElement;
      this.listenScrollContainer(this.container.element);
      this.createPullAction(element, this.container.element);
    })
  }
}
