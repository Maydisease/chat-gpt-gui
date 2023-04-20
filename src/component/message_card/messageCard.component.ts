import {
    Component,
    ComponentFactoryResolver,
    OnInit,
    DoCheck,
    Input,
    Renderer2,
    ViewChild,
    NgZone,
    ViewContainerRef, ChangeDetectorRef
} from '@angular/core';
import {MarkdownService} from "../../services/markdown.service";
import {AppService, HISTORY_LIST_ITEM_STATE} from "../../app/app.service";
import {AskFavoriteList} from "../../app/app.model";
import {PlatformUtilService} from "../../utils/platform.util";
import {HighlightService} from "../../services/highlight.service";

export enum MESSAGE_CARD_USE_TYPE {
    ASK = 'ask',
    FAVORITE = 'favorite'
}

@Component({
    selector: 'message-card',
    templateUrl: './messageCard.component.html',
    styleUrls: ['./messageCard.component.scss'],
})

export class MessageCardComponent implements OnInit, DoCheck {

    MESSAGE_CARD_USE_TYPE = MESSAGE_CARD_USE_TYPE;

    public count = 0;

    @Input('type') type: MESSAGE_CARD_USE_TYPE = MESSAGE_CARD_USE_TYPE.ASK;
    @Input('dataList') dataList: AskFavoriteList = [];

    public HISTORY_LIST_ITEM_STATE = HISTORY_LIST_ITEM_STATE;

    // public askList: AskFavoriteList = [
    //     {
    //         updateTime: new Date().getTime(),
    //         questionContent: '今天天气不错',
    //         answerMarkdown: `# 答案`,
    //         answerContent: '',
    //         id: 33333,
    //         key: '333',
    //         state: HISTORY_LIST_ITEM_STATE.FINISH,
    //         inputTime: new Date().getTime(),
    //     },
    //     {
    //         updateTime: new Date().getTime(),
    //         questionContent: '今天天气不错',
    //         answerMarkdown: `# 答案`,
    //         answerContent: '',
    //         id: 33333,
    //         state: HISTORY_LIST_ITEM_STATE.FAIL,
    //         inputTime: new Date().getTime(),
    //     },
    //     {
    //         updateTime: new Date().getTime(),
    //         questionContent: '今天天气不错',
    //         answerMarkdown: `# 答案`,
    //         answerContent: '',
    //         id: 33333,
    //         state: HISTORY_LIST_ITEM_STATE.PENDING,
    //         inputTime: new Date().getTime(),
    //     }
    // ];

    constructor(
        public ngZone: NgZone,
        public platformUtilService: PlatformUtilService,
        public appService: AppService,
        public highlightService: HighlightService,
        public cdr: ChangeDetectorRef
    ) {

    }

    @ViewChild('dynamicComponent', {read: ViewContainerRef}) dynamicComponent: ViewContainerRef | undefined;


    public async add() {

    }

    public ngOnInit() {
        console.log('this.dataList', this.dataList)
    }

    public ngDoCheck() {
    }
}
