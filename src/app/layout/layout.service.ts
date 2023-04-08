import {Injectable} from '@angular/core';
import {AppService} from "../app.service";

@Injectable({providedIn: 'root'})
export class LayoutService {

    public searchWidgetIsFocus = false;
    public isUsedHistorySearchKeying = false;

    constructor(
        public appService: AppService
    ) {
    }

    public settingPanelDisplayHandle() {
        this.appService.isOpenSettingPanel = !this.appService.isOpenSettingPanel;
    }

    public useHistorySearchHandle(code: string) {

        if (this.appService.searchKey && !this.isUsedHistorySearchKeying) {
            return;
        }

        this.appService.updateHistorySearchKeyListSelectedIndex(code);
    }

    public searchKeyBlur() {
        setTimeout(() => {
            this.searchWidgetIsFocus = false;
            this.appService.isOpenHistorySearchListPanel = false;
            this.appService.autosizeRef?.reset();
            this.appService.autosizeRef?.resizeToFitContent(true)
        }, 100);
    }

    // 输入回车事件时(使用选中的历史搜索关键字)
    public keyEnterHandle() {
        if ((this.appService.searchKey) && !this.isUsedHistorySearchKeying) {
            return;
        }

        if (!this.appService.isOpenHistorySearchListPanel) {
            return;
        }

        const findItem = this.appService.historySearchKeyList.find((item) => item.selected);
        if (findItem) {
            this.appService.searchKey = findItem.key;
            this.appService.isOpenHistorySearchListPanel = false;
            this.isUsedHistorySearchKeying = true;
            this.appService.autosizeRef?.reset();
        }
    }

    public get displaySearchWidgetTips() {
        return !this.appService.searchKey;
    }

    // 搜索关键字变更
    public searchKeyChangeHandle(value: string) {
        this.appService.autosizeRef!.reset();
        this.isUsedHistorySearchKeying = false;
        if (this.appService.searchKey) {
            this.appService.isOpenHistorySearchListPanel = false;
        }
    }

    public historySearchListPanelDetachHandle() {
        this.appService.isOpenHistorySearchListPanel = false;
    }
}
