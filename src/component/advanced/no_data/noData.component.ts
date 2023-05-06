import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {AppService, HISTORY_LIST_ITEM_STATE, STREAM_STATE} from "../../../app/app.service";
import {PlatformUtilService} from "../../../utils/platform.util";
import {ContextService} from "../context/context.service";

@Component({
    selector: 'app-no-data',
    templateUrl: './noData.component.html',
    styleUrls: ['./noData.component.scss'],
})

export class NoDataComponent implements OnInit {

    public promptDemoText = '我想让你担任技术评论员。我会给你一项新技术的名称，你会向我提供深入的评论 - 包括优点、缺点、功能以及与市场上其他技术的比较。我的第一个建议请求是“我正在审查 iPhone 11 Pro Max”。';

    constructor(
        public contextService: ContextService,
        public appService: AppService,
        public platformUtilService: PlatformUtilService,
    ) {
    }

    ngOnInit() {

    }

    public repairContextToAskChat() {
        const askContextList = JSON.parse(JSON.stringify(this.contextService.askContextList));
        for(let i=0; i< askContextList.length; i++){
            const item = askContextList[i];
            const [questionItem, answerItem] = item.list;
            this.appService.updateAskList(`${item.id!}`, answerItem.content, questionItem.content, HISTORY_LIST_ITEM_STATE.FINISH, STREAM_STATE.DONE, item.updateTime);
        }
    }

    tryPromptDemo(){
        this.appService.searchKey = this.promptDemoText;
    }
}
