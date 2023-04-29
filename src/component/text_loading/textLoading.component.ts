import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
    selector: 'text-loading',
    templateUrl: 'textLoading.component.html',
    styleUrls: ['./textLoading.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TextLoadingComponent implements OnInit {
    constructor() {
    }

    ngOnInit() {
    }
}
