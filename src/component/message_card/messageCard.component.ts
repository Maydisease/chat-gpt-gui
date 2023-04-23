import {
    Component,
    ComponentFactoryResolver,
    OnInit,
    DoCheck,
    Input,
    Renderer2,
    ViewChild,
    NgZone,
    ViewContainerRef, ChangeDetectorRef, ElementRef, AfterViewInit
} from '@angular/core';
import {MarkdownService} from "../../services/markdown.service";
import {AppService, HISTORY_LIST_ITEM_STATE} from "../../app/app.service";
import {AskFavoriteList} from "../../app/app.model";
import {PlatformUtilService} from "../../utils/platform.util";
import {HighlightService} from "../../services/highlight.service";
import {MessageCardService} from "./messageCard.service";
import {ObserversModule} from '@angular/cdk/observers';

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

    constructor(
        public appService: AppService,
        public platformUtilService: PlatformUtilService
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
        return len - i;
    }

    trackByMethod(index: number, el: any): number {
        return index;
    }
}
