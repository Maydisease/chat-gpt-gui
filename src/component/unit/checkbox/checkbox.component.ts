import {
    Component,
    Directive,
    OnInit,
    Input,
    Renderer2,
    ComponentRef,
    Output,
    EventEmitter,
    OnDestroy
} from '@angular/core';
import {CheckboxClickHandleDirective} from "./checkboxClickHandle.directive";
import {CheckboxListDirective} from "./checkboxList.directive";
import {Subscription} from "rxjs";

@Component({
    selector: 'checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss']
})

export class CheckboxComponent implements OnInit, OnDestroy {

    @Input('key') key: any;

    @Output('checkEvent') checkEvent = new EventEmitter();

    @Input('checkboxClickHandleRef') checkboxBtnRef!: CheckboxClickHandleDirective;
    @Input('checkboxListRef') checkboxListRef!: CheckboxListDirective;

    public selected = false;
    @Input('defaultSelected') defaultSelected: boolean = false;

    public allEventSubscription: Subscription | undefined;

    constructor(
        public r2: Renderer2
    ) {
    }

    ngOnInit() {

        this.allEventSubscription = this.checkboxListRef.allEvent.subscribe((isAllSelected) => {
            if (isAllSelected) {
                console.log('130')
                this.selected = true;
                this.checkboxListRef.add(this.key, true);
            } else {
                console.log('131')
                this.selected = false;
            }
        })

        this.r2.listen(this.checkboxBtnRef.element, 'click', () => {
            this.selected = !this.selected;
            this.checkboxListRef.add(this.key, this.selected);
        })
    }

    selectedHandle() {
        this.selected = !this.selected;
    }

    ngOnDestroy() {
        this.allEventSubscription?.unsubscribe();
    }
}
