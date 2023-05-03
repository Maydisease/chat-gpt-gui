import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'switch',
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.scss']
})

export class SwitchComponent implements OnInit {

    @Input('defaultActiveState') defaultActiveState = false;
    @Output('change') change = new EventEmitter();

    public active = false;

    constructor() {
        this.defaultActiveState = this.active;
    }

    ngOnInit() {
    }

    handle() {
        this.active = !this.active;
        this.change.emit(this.active);
    }
}
