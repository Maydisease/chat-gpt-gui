import {Directive, ElementRef, Renderer2, Input, ViewChild} from '@angular/core';

@Directive({selector: '[layout-splitter]'})
export class LayoutSplitterDirective {

    public startMousedownX: number | null = null;
    public currentElementWidthNum = 0;
    public sourceElementWidthNum = 0;
    public lock = true;

    public getElementWidthNum() {
        return parseInt(window.getComputedStyle((this.el.nativeElement as HTMLElement).previousElementSibling!).width);
    }

    constructor(public el: ElementRef, public renderer: Renderer2) {
        this.sourceElementWidthNum = this.getElementWidthNum();
        const div = this.renderer.createElement('div');
        // this.renderer.appendChild(div, text);
        this.renderer.addClass(div, 'split-controller');
        this.renderer.setStyle(div, 'color', 'red');
        this.renderer.appendChild(this.el.nativeElement, div);

        this.renderer.listen('window', 'mousedown', ($event: MouseEvent) => {

            if ($event.button !== 0) {
                return;
            }

            const element = $event.target as HTMLElement;
            this.currentElementWidthNum = this.getElementWidthNum();
            if (element.className === 'split-controller' || element.closest('.split-controller')) {
                this.lock = false;
                this.startMousedownX = $event.screenX;
                this.renderer.addClass(div, 'active');
                this.renderer.addClass(document.querySelector('body')!, 'disable-selected-all');
            }

        });

        this.renderer.listen('window', 'mousemove', ($event: MouseEvent) => {
            if (!this.lock) {
                const movePosX = $event.screenX - this.startMousedownX!;
                const element = this.el.nativeElement as HTMLElement;
                let newWidthNum = this.currentElementWidthNum + movePosX;
                if (newWidthNum <= 280) {
                    newWidthNum = this.getElementWidthNum();
                }
                if (newWidthNum > 480) {
                    newWidthNum = this.getElementWidthNum();
                }
                this.renderer.setStyle(element.previousElementSibling, 'width', `${newWidthNum}px`);
            }
        });

        this.renderer.listen('window', 'mouseup', ($event: MouseEvent) => {

            if ($event.button !== 0) {
                return;
            }

            this.currentElementWidthNum = 0;
            this.startMousedownX = null;
            this.lock = true;
            this.renderer.removeClass(div, 'active');
            this.renderer.removeClass(document.querySelector('body')!, 'disable-selected-all');
        });
    }
}
