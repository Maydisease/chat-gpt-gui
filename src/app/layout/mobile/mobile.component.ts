import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppService, HISTORY_LIST_ITEM_STATE, TAB_STATE} from "../../app.service";
import {PlatformUtilService} from "../../../utils/platform.util";
import {LayoutService} from "../layout.service";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";

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
    public TAB_STATE = TAB_STATE;

    constructor(
        public layoutService: LayoutService,
        public platformUtilService: PlatformUtilService,
        public appService: AppService,
    ) {

    }

    ngOnInit() {
        this.appService.autosizeRef = this.autosizeRef;
        this.appService.appKeyWidgetRef = this.appKeyWidgetRef;
        this.appService.searchWidgetRef = this.searchWidgetRef;
        this.appService.historyElementRef = this.historyElementRef;
    }
}
