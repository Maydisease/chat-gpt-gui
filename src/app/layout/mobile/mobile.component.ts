import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppService, HISTORY_LIST_ITEM_STATE, STREAM_STATE, TAB_STATE} from "../../app.service";
import {PlatformUtilService} from "../../../utils/platform.util";
import {LayoutService} from "../layout.service";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {ThemeService} from "../../../services/theme.service";
import {appWindow} from "@tauri-apps/api/window";
import {MESSAGE_CARD_USE_TYPE} from "../../../component/message_card/messageCard.component";

@Component({
    selector: 'app-mobile',
    templateUrl: './mobile.component.html',
    styleUrls: ['./mobile.component.scss', '../layout-preview.scss']
})

export class MobileComponent implements OnInit {

    @ViewChild('autosize', {static: true}) autosizeRef: CdkTextareaAutosize | undefined;
    @ViewChild('appKeyWidgetRef', {static: true}) appKeyWidgetRef: ElementRef<HTMLTextAreaElement> | undefined;
    @ViewChild('searchWidgetRef', {static: true}) searchWidgetRef: ElementRef<HTMLInputElement> | undefined;
    @ViewChild('historyElementRef', {static: true}) historyElementRef: ElementRef<HTMLElement> | undefined;

    public HISTORY_LIST_ITEM_STATE = HISTORY_LIST_ITEM_STATE;

    public MESSAGE_CARD_USE_TYPE = MESSAGE_CARD_USE_TYPE;
    public TAB_STATE = TAB_STATE;

    public STREAM_STATE = STREAM_STATE;

    constructor(
        public themeService: ThemeService,
        public layoutService: LayoutService,
        public platformUtilService: PlatformUtilService,
        public appService: AppService
    ) {

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

    public get SHOW_NO_DATA(){
        return this.appService.newTempDataAppEndState === STREAM_STATE.DONE && this.appService.askList.length === 0;
    }

}
