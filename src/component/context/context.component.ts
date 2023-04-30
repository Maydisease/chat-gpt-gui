import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {AppService, AskContextList} from "../../app/app.service";
import {ChatGptTokensUtil} from "../../utils/chatGptTokens.util";
import {CheckboxListDirective} from "../unit/checkbox/checkboxList.directive";
import {ContextContextBase} from "./context.service";

@Component({
    templateUrl: './context.component.html',
    styleUrls: ['./context.component.scss']
})

export class ContextComponent implements OnInit {

    @ViewChild('checkboxListRef') checkboxListRef!: CheckboxListDirective;

    constructor(
        public appService: AppService,
        @Inject('context') public context: ContextContextBase
    ) {
    }

    public tokenTotal = 0;
    public selectedToken = 0;

    public defaultSelected = false;

    public removeContextList: string[] = [];

    ngOnInit() {
        this.computedTotalToken();
    }

    selectedAll() {
        if (this.checkboxListRef.isSelectedAll) {
            this.checkboxListRef.cleanAll();
        } else {
            this.checkboxListRef.selectedAll();
        }
    }

    computedTotalToken() {
        this.appService.askContext.map((item, itemIndex) => {
            this.tokenTotal += item.token!;
        });
    }

    computedToken() {
        this.selectedToken = 0;
        this.tokenTotal = 0;
        this.checkboxListRef.list.map((id) => {
            const findItem = this.appService.askContext.find((item) => item.id === id);
            if (findItem) {
                this.selectedToken += findItem.token!;
            }
        });
        this.computedTotalToken();
    }

    checkboxChangeHandle(list: string[]) {
        this.computedToken();
    }

    removeContextHandle() {
        this.appService.askContext = this.appService.askContext.filter((item) => {
            return !this.checkboxListRef.list.includes(item.id);
        });
        this.checkboxListRef.list = [];
        this.computedToken();
    }

    close() {
        this.context.$m?.detach(this.context.$m?.key)
    }
}
