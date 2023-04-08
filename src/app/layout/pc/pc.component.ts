import {Component, OnInit} from '@angular/core';
import {AppService, HISTORY_LIST_ITEM_STATE, TAB_STATE} from "../../app.service";

@Component({
    selector: 'app-pc',
    templateUrl: './pc.component.html',
    styleUrls: ['./pc.component.scss', '../layout-preview.scss']
})

export class LayoutForPcComponent implements OnInit {

    public HISTORY_LIST_ITEM_STATE = HISTORY_LIST_ITEM_STATE;
    public TAB_STATE = TAB_STATE;

    constructor(
        public appService: AppService,
    ) {

    }

    ngOnInit() {
    }
}
