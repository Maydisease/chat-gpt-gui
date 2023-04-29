import {Directive, ElementRef, EventEmitter, HostListener, Output, ViewChild} from '@angular/core';

@Directive({
    selector: '[checkboxList]',
    exportAs: 'checkboxListRef'
})
export class CheckboxListDirective {

    public element: ElementRef;

    public list: any[] = [];
    public isSelectedAll = false;

    @Output('checkboxChange') checkboxChange = new EventEmitter();

    public allEvent = new EventEmitter();

    public timer: any;

    @ViewChild('checkboxListTrigger') trigger!: ElementRef<HTMLElement>;

    constructor(readonly el: ElementRef) {
        this.element = el.nativeElement;
    }

    send() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.checkboxChange.emit(this.list);
        }, 100);
    }

    add(value: any, isSelected: boolean) {

        if (isSelected && !this.list.includes(value)) {
            this.list.push(value);
        }

        if (!isSelected && this.list.includes(value)) {
            this.list = this.list.filter((item) => {
                return item !== value;
            })
        }

        console.log('this.list:', this.list)
        this.send();
    }

    selectedAll() {
        this.isSelectedAll = true;
        this.allEvent.emit(true);
        this.send();
    }

    cleanAll() {
        this.isSelectedAll = false;
        this.allEvent.emit(false);
        this.list = [];
        this.send();
    }

    clean(value: any) {
        if (this.list.includes(value)) {
            this.list = this.list.filter((item) => {
                return item === value;
            })
        }
    }

    @HostListener('click', ['$event'])
    handle() {

    }
}
