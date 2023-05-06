import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[as]',
  exportAs: 'asRef'
})
export class AsDirective {

  public element!: HTMLElement;

  constructor(
    element: ElementRef
  ) { 
    this.element = element.nativeElement as HTMLElement;
  }
}