import {Injectable, inject, Injector} from '@angular/core';
import {SettingComponent} from "./setting.componet";
import {DynamicLoadService} from "../../../services/dynamicLoad.service";
import {SettingConfigItem, SettingModel} from "./setting.model";
import {OverlayRef} from "@angular/cdk/overlay";
import {HistoryService} from "../histroy/history.service";
import {AppService} from "../../../app/app.service";
import {ContextService} from "../context/context.service";
import {ToastService} from "../../unit/toast/toast.service";
import {ConfigService} from "../../../config/config.service";

export enum CLEAR_TYPE {
    HISTORY,
    CONTEXT,
    FAVORITE,
    ALL,
    RESET
}

@Injectable({providedIn: 'root'})
export class SettingService {

    public isLoading = false;

    public timer: any;

    public CONFIG_BACKUP: SettingConfigItem | { [key: string]: any } = {};

    public favoriteDataCount = 0;
    public contextDataCount = 0;
    public historyDataCount = 0;

    public ref: OverlayRef | undefined;

    constructor(
        public configService: ConfigService,
        public toastService: ToastService,
        public dynamicLoad: DynamicLoadService,
        public settingModel: SettingModel,
        private injector: Injector
    ) {
        this.initConfig();
    }

    public async initConfig() {
        this.CONFIG_BACKUP = JSON.parse(JSON.stringify(this.configService.CONFIG));
        this.isLoading = true;
        const isExist = await this.settingModel.count();
        if (!isExist) {
            await this.settingModel.update(this.configService.CONFIG)
        } else {
            await this.loadSetting();
        }
        this.isLoading = false;
        await this.getCount();

    }

    public async getCount() {
        this.favoriteDataCount = await this.injectAppService().getFavoriteCount();
        this.historyDataCount = await this.injectHistoryService().getCount();
        this.contextDataCount = await this.injectContextService().getCount();
    }

    public async loadSetting() {
        const response = await this.settingModel.get();
        if (response) {
            this.configService.CONFIG.BASE_SECRET_KEY = response.BASE_SECRET_KEY;
            this.configService.CONFIG.CONTEXT_ENABLE = response.CONTEXT_ENABLE;
            this.configService.CONFIG.CONTEXT_ENABLE_AUTO_CUT = response.CONTEXT_ENABLE_AUTO_CUT;
        }
    }

    open() {
        const [_, ref] = this.dynamicLoad.create(SettingComponent);
        this.ref = ref;
    }

    close() {
        this.ref?.detach();
    }

    public async update() {
        return await this.settingModel.update(this.configService.CONFIG);
    }

    public async clearTypeAll() {
        await this.injectContextService().clearAll();
        await this.injectAppService().favoriteClearAll();
        await this.injectHistoryService().cleanAll();
        await this.injectAppService().askListClearAll();
    }

    public async settingClear() {
        await this.settingModel.clear();
        this.configService.CONFIG = JSON.parse(JSON.stringify(this.CONFIG_BACKUP));
    }

    async clearHandle(type: CLEAR_TYPE) {

        if (type === CLEAR_TYPE.CONTEXT) {
            await this.injectContextService().clearAll();
        }

        if (type === CLEAR_TYPE.FAVORITE) {
            await this.injectAppService().favoriteClearAll();
        }

        if (type === CLEAR_TYPE.HISTORY) {
            await this.injectHistoryService().cleanAll();
        }

        if (type === CLEAR_TYPE.ALL) {
            await this.clearTypeAll();

        }

        if (type === CLEAR_TYPE.RESET) {
            await this.clearTypeAll();
            await this.settingClear();
        }
        await this.getCount();
        this.toastService.create('处理成功~')

    }

    public secretKeySave(event?: FocusEvent) {

        if (event) {
            const element = event.target as HTMLTextAreaElement;
            element.value = element.value.trim();
            this.configService.CONFIG.BASE_SECRET_KEY = element.value;
        }

        clearTimeout(this.timer);
        this.timer = setTimeout(async () => {
            await this.update();
        }, 500)
    }

    async secretKeyChangeHandle(event: KeyboardEvent) {
        const element = event.target as HTMLTextAreaElement;
        element.value = element.value.trim();
        this.configService.CONFIG.BASE_SECRET_KEY = element.value;
        this.secretKeySave();
    }

    async contextEnableChangeHandle(value: boolean) {
        this.configService.CONFIG.CONTEXT_ENABLE = value ? 1 : 0;
        await this.update();
    }

    async contextEnableAutoCutChangeHandle(value: boolean) {
        this.configService.CONFIG.CONTEXT_ENABLE_AUTO_CUT = value ? 1 : 0;
        await this.update();
    }

    public injectContextService(): ContextService {
        return this.injector.get(ContextService);
    }

    public injectAppService(): AppService {
        return this.injector.get(AppService);
    }

    public injectHistoryService(): HistoryService {
        return this.injector.get(HistoryService);
    }
}
