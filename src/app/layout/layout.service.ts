import {Injectable} from '@angular/core';
import {AppService} from "../app.service";
import {PlatformUtilService} from "../../utils/platform.util";

@Injectable({providedIn: 'root'})
export class LayoutService {

    public searchWidgetIsFocus = false;
    public isUsedHistorySearchKeying = false;

    constructor(
        public appService: AppService,
        public platformUtilService: PlatformUtilService
    ) {
    }

    public settingPanelDisplayHandle() {
        this.appService.isOpenSettingPanel = !this.appService.isOpenSettingPanel;
    }

    public searchKeyBlur() {
        setTimeout(() => {
            this.searchWidgetIsFocus = false;
            this.appService.isOpenHistorySearchListPanel = false;
            this.appService.autosizeRef?.reset();
            this.appService.autosizeRef?.resizeToFitContent(true)
        }, 100);
    }

    public get displaySearchWidgetTips() {
        return !this.appService.searchKey && !this.platformUtilService.isBrowserMobile;
    }

    // 搜索关键字变更
    public searchKeyChangeHandle(value: string) {
        if (value === '') {
            this.appService.autosizeRef!.reset();
        } else {
            this.appService.autosizeRef!.resizeToFitContent(true);
        }
        this.isUsedHistorySearchKeying = false;
        if (this.appService.searchKey) {
            this.appService.isOpenHistorySearchListPanel = false;
        }
    }
}
