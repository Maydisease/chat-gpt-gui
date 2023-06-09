import {Component, OnInit} from '@angular/core';
import {CLEAR_TYPE, SettingService} from "./setting.service";
import {ModalService} from "../../unit/modal/modal.service";
import {ConfigService} from "../../../config/config.service";
import {PlatformUtilService} from "../../../utils/platform.util";

@Component({
    selector: 'setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss']
})

export class SettingComponent implements OnInit {

    public CLEAR_TYPE = CLEAR_TYPE;

    public timer: any;

    constructor(
        public configService: ConfigService,
        public settingService: SettingService,
        public modalService: ModalService,
        public platformUtilService: PlatformUtilService
    ) {
        this.settingService.initConfig();
        this.settingService.getCount();
    }

    public async ngOnInit() {

    }

    public get IS_CAN_CLEAR_ALL() {
        return this.settingService.contextDataCount > 0 || this.settingService.historyDataCount > 0 || this.settingService.favoriteDataCount > 0;
    }

    public close() {
        this.settingService.close();
    }

    public get getUsedRote() {
        const rote = parseFloat((this.settingService.todayQuota / this.settingService.userInfo.maxCount).toFixed(2));
        return (100 - (rote * 100)) * -1;
    }


}
