import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {AppService} from "../../app/app.service";
import {PlatformUtilService} from "../../utils/platform.util";

@Component({
    selector: 'app-no-data',
    templateUrl: './noData.component.html',
    styleUrls: ['./noData.component.scss'],
})

export class NoDataComponent implements OnInit {

    public promptDemoText = '我想让你担任技术评论员。我会给你一项新技术的名称，你会向我提供深入的评论 - 包括优点、缺点、功能以及与市场上其他技术的比较。我的第一个建议请求是“我正在审查 iPhone 11 Pro Max”。';

    constructor(
        public appService: AppService,
        public platformUtilService: PlatformUtilService,
    ) {
    }

    ngOnInit() {

    }

    tryPromptDemo(){
        this.appService.searchKey = this.promptDemoText;
    }
}
