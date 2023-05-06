import {Component, OnInit, Input, HostBinding, SimpleChanges} from '@angular/core';

@Component({
    selector: 'u-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})

export class UButtonComponent implements OnInit {

    @Input('type') type: 'default' | 'danger' | 'primary' = 'default';
    @Input('size') size: 'large' | 'small' | 'medium' = 'medium';
    @Input('disabled') disabled: boolean = false;
    @HostBinding('class.disabled') hostDisabled = false;


    constructor() {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('disabled' in changes) {
            const newValue = changes['disabled'].currentValue;
            this.disabled = newValue;
            this.hostDisabled = newValue;
        }
    }

    public getButtonClass() {
        return {
            'default': this.type === 'default',
            'danger': this.type === 'danger',
            'primary': this.type === 'primary',
            'large': this.size === 'large',
            'small': this.size === 'small',
            'medium': this.size === 'medium',
        }
    }

    ngOnInit() {
        this.hostDisabled = this.disabled;
    }
}
