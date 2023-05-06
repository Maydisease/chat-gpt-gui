import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'u-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})

export class UButtonComponent implements OnInit {

    @Input('type') type: 'default' | 'danger' | 'primary' = 'default';

    constructor() {
    }

    ngOnInit() {
    }
}
