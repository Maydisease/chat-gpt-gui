import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
    selector: 'new-temp-render-container',
    templateUrl: './newTemp.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class NewTempComponent implements OnInit {
    constructor() {
    }

    ngOnInit() {
    }
}
