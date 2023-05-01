import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AppService, HISTORY_LIST_ITEM_STATE, STREAM_STATE, TAB_STATE} from "../../app.service";
import {PlatformUtilService} from "../../../utils/platform.util";
import {LayoutService} from "../layout.service";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {ThemeService} from "../../../services/theme.service";
import {appWindow} from "@tauri-apps/api/window";
import {MESSAGE_CARD_USE_TYPE} from "../../../component/message_card/messageCard.component";
import {ContextService} from "../../../component/context/context.service";
import {ASK_KEYBOARD_EVENT_NAME, SendActionService} from "../../../services/sendAction.service";
import {Subscription} from "rxjs";
import {HistoryService} from "../../../component/histroy/history.service";

@Component({
    selector: 'app-mobile',
    templateUrl: './mobile.component.html',
    styleUrls: ['./mobile.component.scss', '../layout-preview.scss']
})

export class MobileComponent implements OnInit, OnDestroy {

    @ViewChild('autosize', {static: true}) autosizeRef: CdkTextareaAutosize | undefined;
    @ViewChild('appKeyWidgetRef', {static: true}) appKeyWidgetRef: ElementRef<HTMLTextAreaElement> | undefined;
    @ViewChild('searchWidgetRef', {static: true}) searchWidgetRef: ElementRef<HTMLInputElement> | undefined;
    @ViewChild('historyElementRef', {static: true}) historyElementRef: ElementRef<HTMLElement> | undefined;

    public MESSAGE_CARD_USE_TYPE = MESSAGE_CARD_USE_TYPE;
    public TAB_STATE = TAB_STATE;


    public  askKeyboardEventSubscription:  Subscription | undefined;

    constructor(
        public platformUtilService: PlatformUtilService,
        public contextService: ContextService,
        public themeService: ThemeService,
        public layoutService: LayoutService,
        public appService: AppService,
        public sendAction: SendActionService,
        public historyService: HistoryService
    ) {
        this.askKeyboardEventSubscription = this.sendAction.askKeyboardEvent.subscribe((event) => {
            if (event.eventName === ASK_KEYBOARD_EVENT_NAME.SEND) {
                this.appService.send();
            }
        });
    }

    ngOnInit() {
        this.appService.autosizeRef = this.autosizeRef;
        this.appService.appKeyWidgetRef = this.appKeyWidgetRef;
        this.appService.searchWidgetRef = this.searchWidgetRef;
        this.appService.historyElementRef = this.historyElementRef;
    }

    themeHandle(event: Event) {
        const target = event.target as HTMLOptionElement;
        this.themeService.setTheme(target.value as 'Dark' | 'Light');
    }

    public get SHOW_NO_DATA() {
        return this.appService.newTempDataAppEndState === STREAM_STATE.DONE && this.appService.askList.length === 0;
    }

    historySelectedEventHandle(value: string) {
        this.appService.searchKey = value;
    }

    ngOnDestroy() {
        this.askKeyboardEventSubscription?.unsubscribe();
    }

}
