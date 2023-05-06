import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'arrow-down-icon',
    styles: [`
        :host{
            display: flex;
            justify-content: center;
            align-items: center;
            align-content: center;
            justify-items: center;
        }
        svg{font-weight:bold;}
    `],
    template: `
      <svg viewBox="64 64 896 896" focusable="false" fill="currentColor" width="1em" height="1em" data-icon="arrow-down" aria-hidden="true"><path d="M862 465.3h-81c-4.6 0-9 2-12.1 5.5L550 723.1V160c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v563.1L255.1 470.8c-3-3.5-7.4-5.5-12.1-5.5h-81c-6.8 0-10.5 8.1-6 13.2L487.9 861a31.96 31.96 0 0048.3 0L868 478.5c4.5-5.2.8-13.2-6-13.2z"></path></svg>
    `
})

export class ArrowDownComponent implements OnInit {
    constructor() {
    }

    ngOnInit() {
    }
}
