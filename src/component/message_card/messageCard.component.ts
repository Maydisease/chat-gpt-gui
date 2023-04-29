import {
    Component,
    OnInit,
    DoCheck,
    Input,
    ViewChild,
    ViewContainerRef, ElementRef, AfterViewInit, ChangeDetectorRef, NgZone
} from '@angular/core';
import {AppService, HISTORY_LIST_ITEM_STATE, STREAM_STATE} from "../../app/app.service";
import {AskFavoriteList} from "../../app/app.model";
import {PlatformUtilService} from "../../utils/platform.util";
import {ContextService} from "../context/context.service";

export enum MESSAGE_CARD_USE_TYPE {
    ASK = 'ask',
    FAVORITE = 'favorite'
}

@Component({
    selector: 'message-card',
    templateUrl: './messageCard.component.html',
    styleUrls: ['./messageCard.component.scss'],
})

export class MessageCardComponent implements OnInit, DoCheck, AfterViewInit {

    @ViewChild('messageCardsElementRef', {static: true}) messageCardsElementRef!: ElementRef<HTMLDivElement>;
    @ViewChild('pullDownElementRef', {static: false}) pullDownElementRef!: ElementRef<HTMLDivElement>;

    MESSAGE_CARD_USE_TYPE = MESSAGE_CARD_USE_TYPE;

    public count = 0;

    @Input('type') type: MESSAGE_CARD_USE_TYPE = MESSAGE_CARD_USE_TYPE.ASK;
    @Input('dataList') dataList: AskFavoriteList = [];

    public HISTORY_LIST_ITEM_STATE = HISTORY_LIST_ITEM_STATE;

    public STREAM_STATE = STREAM_STATE;


    constructor(
        public contextService: ContextService,
        public appService: AppService,
        public platformUtilService: PlatformUtilService,
        public cdr: ChangeDetectorRef,
        public ngZone: NgZone
    ) {
    }

    @ViewChild('dynamicComponent', {read: ViewContainerRef}) dynamicComponent: ViewContainerRef | undefined;

    public ngOnInit() {


    }

    ngAfterViewInit() {

    }

    public ngDoCheck() {
    }

    public getDataNumber(i: number) {
        const len = this.dataList.length;
        return this.platformUtilService.isPC ? len - i : i + 1;
    }

    public againSend(keyword: string | undefined, autoSend = false) {
        if (keyword) {
            this.appService.searchKey = keyword;
            if (autoSend) {
                this.appService.send();
            }
        }
    }

    public copyQuestion(value: string | undefined) {
        if (value) {

        }
    }

    trackByMethod(index: number, el: any): number {
        return index;
    }

    public get HIDE_PENDING_STATE() {
        return this.appService.newTempDataAppEndState !== STREAM_STATE.PENDING;
    }

    public get SHOW_TEMP_CARD() {
        return this.appService.newTempDataAppEndState !== STREAM_STATE.DONE;
    }

    public get HIDE_FINISH_STATE() {
        return this.appService.newTempDataAppEndState === STREAM_STATE.PENDING;
    }
}
