import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {AppService, AskContextList} from "../../app/app.service";
import {ChatGptTokensUtil} from "../../utils/chatGptTokens.util";
import {CheckboxListDirective} from "../unit/checkbox/checkboxList.directive";
import {ContextContextBase, ContextService} from "./context.service";

@Component({
    templateUrl: './context.component.html',
    styleUrls: ['./context.component.scss']
})

export class ContextComponent implements OnInit {

    @ViewChild('checkboxListRef') checkboxListRef!: CheckboxListDirective;

    constructor(
        public appService: AppService,
        public contextService: ContextService,
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
        this.contextService.askContextList.map((item, itemIndex) => {
            this.tokenTotal += item.token!;
        });
    }

    computedToken() {
        this.selectedToken = 0;
        this.tokenTotal = 0;
        this.checkboxListRef.list.map((id) => {
            const findItem = this.contextService.askContextList.find((item) => item.id === id);
            if (findItem) {
                this.selectedToken += findItem.token!;
            }
        });
        this.computedTotalToken();
    }

    checkboxChangeHandle(list: string[]) {
        this.computedToken();
    }

    public get HIDE_NO_DATA() {
        const {enableAskContext, askContextList} = this.contextService;
        return enableAskContext && askContextList.length > 0;
    }

    async removeContextHandle() {

        this.contextService.askContextList.map(async (item) => {
            if (this.checkboxListRef.list.includes(item.id)) {
                await this.contextService.delete(item.id!);
            }
        });

        this.contextService.askContextList = await this.contextService.getList();

        this.checkboxListRef.list = [];
        this.computedToken();
        await this.contextService.computedTotalToken();
    }

    close() {
        this.context.$m?.detach(this.context.$m?.key)
    }
}
