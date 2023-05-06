import {Component, OnInit, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';

@Component({
    selector: 'switch',
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.scss']
})

export class SwitchComponent implements OnInit {

    @Input('defaultActiveState') defaultActiveState = false;
    @Output('change') change = new EventEmitter();

    public active = this.defaultActiveState;

    constructor() {
        this.defaultActiveState = this.active;
    }

    ngOnInit() {
    }

    handle() {
        this.active = !this.active;
        this.change.emit(this.active);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('defaultActiveState' in changes) {
            const newValue = changes['defaultActiveState'].currentValue;
            if (newValue !== this.active) {
                this.active = newValue;
            }
        }
    }
}
