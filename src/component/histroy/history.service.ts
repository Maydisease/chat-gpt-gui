import {Injectable, OnChanges, SimpleChanges} from '@angular/core';
import {
    HISTORY_KEYBOARD_EVENT_NAME,
    HISTORY_KEYBOARD_SELECT_VALUE,
    SendActionService
} from "../../services/sendAction.service";
import {GetUniqueIdUtil} from "../../utils/getUniqueId.util";
import {scrollSmoothTo} from "../../utils/scrollToView.util";
import {HistoryListItemList, historyModel} from "./history.model";
import {PlatformUtilService} from "../../utils/platform.util";

@Injectable({providedIn: 'root'})
export class HistoryService {

    public maxLen = 5;

    public selectedValue: string = '';

    public isOpen: boolean = false;

    public lock = false;

    public historyList: HistoryListItemList = [];

    constructor(
        public historyModel: historyModel,
        public getUniqueIdUtil: GetUniqueIdUtil,
        public platformUtilService: PlatformUtilService,
    ) {

        this.platformUtilService.deviceChange.subscribe(() => {
            this.isOpen = false;
        });

    }

    close() {
        this.isOpen = false;
    }

    public async move(type: HISTORY_KEYBOARD_SELECT_VALUE) {

        const historyList = await this.historyModel.getList();
        const findIndex = historyList.findIndex((item) => item.selected);

        if (!historyList.length) {
            return;
        }

        if (!this.isOpen) {
            this.isOpen = true;

            if (findIndex > -1) {
                await this.historyModel.update(historyList[findIndex].id!, {selected: false});
            }

            await this.historyModel.update(historyList[0].id!, {selected: true});
            this.historyList = await this.historyModel.getList();
            return;
        }

        let moveIndex = historyList.length - 1;

        if (findIndex > -1) {
            await this.historyModel.update(historyList[findIndex].id!, {selected: false});
            moveIndex = type === HISTORY_KEYBOARD_SELECT_VALUE.PREV ? findIndex - 1 : findIndex + 1;
            const defaultIndex = type === HISTORY_KEYBOARD_SELECT_VALUE.PREV ? historyList.length - 1 : 0;
            moveIndex = historyList[moveIndex] ? moveIndex : defaultIndex;
        }

        await this.historyModel.update(historyList[moveIndex].id!, {selected: true});
        this.selectedValue = historyList[moveIndex].value;
        this.historyList = await this.historyModel.getList();
        this.moveAnime();
    }

    public moveAnime() {
        setTimeout(() => {
            const listElement = document.getElementById('#history-item-list');
            const selectedElement = document.getElementById('#history-item-selected');
            if (listElement && selectedElement) {
                scrollSmoothTo(undefined, listElement, selectedElement, 0).then(() => {
                });
            }
        }, 0)
    }

    public async update(value: string) {

        const isExist = await this.historyModel.find({value});

        if (isExist) {
            return;
        }

        const historyList = await this.historyModel.getList();
        if (historyList.length > this.maxLen) {
            const id = historyList[0].id;
            if (id) {
                await this.historyModel.delete(id);
            }
        }

        await this.historyModel.add({
            selected: false,
            key: this.getUniqueIdUtil.get(),
            value,
            updateTime: new Date().getTime(),
        });

        this.historyList = await this.historyModel.getList();

    }

    autoClean() {

    }

    public async cleanAll() {
        await this.historyModel.clear();
        this.historyList = await this.historyModel.getList();
        this.isOpen = false;
    }
}
