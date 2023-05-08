import {ElementRef, EventEmitter, Injectable} from '@angular/core';
import {message} from "@tauri-apps/api/dialog";
import Mousetrap from 'mousetrap';
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {AskFavoriteListItem, FavoriteModel, AskFavoriteList} from "./app.model";
import {handleIsTauri} from "../main";
import config from '../../src-tauri/tauri.conf.json';
import {ModalService} from "../component/unit/modal/modal.service";
import {ToastService} from "../component/unit/toast/toast.service";
import {HistoryService} from "../component/advanced/histroy/history.service";
import {ContextService} from "../component/advanced/context/context.service";
import {ConfigService} from "../config/config.service";
import {TrackEventService} from "../services/trackEvent.service";


export enum TAB_STATE {
    FAVORITE_MODE,
    ASK_MODE
}

export enum STREAM_STATE {
    PENDING,
    APPENDING,
    DONE,
    FAIL
}

export enum HISTORY_LIST_ITEM_STATE {
    PENDING,
    FINISH,
    FAIL
}

export enum HISTORY_LIST_ITEM_TYPE {
    'ANSWER' = 'answer',
    'QUESTION' = 'question',
}

export interface HistoryListItem {
    id: string,
    type: HISTORY_LIST_ITEM_TYPE,
    data: string | undefined,
    state: HISTORY_LIST_ITEM_STATE,
    updateTime: number;
}

export interface AskContextItem {
    id: string;
    list: {
        role: 'assistant' | 'user' | 'system';
        content: string;
        token?: number;
    }[]
    updateTime: number;
    token?: number;
}


export type AskContextList = AskContextItem[];

@Injectable({providedIn: 'root'})
export class AppService {

    public worker = new Worker(new URL('./app.worker', import.meta.url));

    public version = config.package.version;
    public isPromptMode = false;
    public favoriteLoading = false;
    public askSendResultEvent = new EventEmitter();
    public tabState: TAB_STATE = TAB_STATE.ASK_MODE;
    public favoriteList: AskFavoriteListItem[] = [];
    public favoriteCount: number = 0;
    public searchKey = '';
    public isOpenHistorySearchListPanel = false;
    public searchWidgetRef: ElementRef<HTMLInputElement> | undefined;
    public historyElementRef: ElementRef<HTMLElement> | undefined;
    public autosizeRef: CdkTextareaAutosize | undefined;
    public askList: AskFavoriteList = [];
    public newTempDataAppEndState: STREAM_STATE = STREAM_STATE.DONE;
    public newTempDataQuestionContent = '';

    constructor(
        public toastService: ToastService,
        public modalService: ModalService,
        public favoriteModel: FavoriteModel,
        public historyService: HistoryService,
        public contextService: ContextService,
        public configService: ConfigService,
        public trackEventService: TrackEventService,
    ) {
        this.initShortcutKeyBind();
        this.initFavorite();
        this.initWorkerMessageListen();
    }

    public initWorkerMessageListen() {

        this.worker.addEventListener('message', async ({data}) => {

            // 请求准备开始
            if (data.eventName === 'requestStart') {
                console.log(1010291)
                this.newTempDataAppEndState = STREAM_STATE.PENDING;
                await this.historyService.add(data.message.questionContent);
                this.clearSearchKey();
                this.askSendResultEvent.emit();
            }

            // response::chunk开始
            if (data.eventName === 'responseChunkStart') {
                this.newTempDataAppEndState = STREAM_STATE.APPENDING;
                this.askSendResultEvent.emit();
            }

            // response::chunk结束
            if (data.eventName === 'responseChunkEnd') {
                this.newTempDataAppEndState = STREAM_STATE.DONE;
                const {key, answerMarkdown, questionContent} = data.message;
                this.updateAskList(key, answerMarkdown, questionContent, HISTORY_LIST_ITEM_STATE.FINISH, STREAM_STATE.DONE);
                await this.contextService.updateContext(questionContent, answerMarkdown);
                this.askSendResultEvent.emit();
            }
            // response::chunk错误
            if (data.eventName === 'responseError') {
                const {key, errorContent, questionContent, errorCode} = data.message;
                this.newTempDataAppEndState = STREAM_STATE.DONE;
                this.updateAskList(
                    key,
                    errorContent,
                    questionContent,
                    HISTORY_LIST_ITEM_STATE.FAIL,
                    STREAM_STATE.DONE,
                    undefined,
                    errorCode
                );
                this.askSendResultEvent.emit();
            }
        })
    }

    // 初始化快捷键绑定
    public initShortcutKeyBind() {
        Mousetrap.bind('command+f', () => {
            this.searchWidgetRef?.nativeElement.focus();
        });
    }

    // 验证是否有配置密钥，如若没有将弹出tauri提供的原生弹窗
    public async checkConfigAppKey() {
        let ok = true;
        if (!this.configService.CONFIG.BASE_SECRET_KEY) {
            if (handleIsTauri()) {
                await message(`未配置GPT密钥，请先配置GPT密钥`, {type: 'warning', title: 'GPT-GUI'});
                // this.isOpenSettingPanel = true;
            } else {
                this.modalService.create(`未配置GPT密钥，请先配置GPT密钥`, {
                    confirm: () => {
                    }
                });
            }
            ok = false;
        }
        return ok;
    }

    // 清理搜索关键字（一般在发送问题之后）
    public clearSearchKey() {
        this.trackEventService.send('clearSearchKey')
        this.searchKey = '';
        this.autosizeRef?.reset();
    }

    // 更新问题集合
    public updateAskList(
        key: string, answerMarkdown: string | undefined,
        questionContent: string | undefined,
        state: HISTORY_LIST_ITEM_STATE,
        streamState: STREAM_STATE,
        $updateTime: number | undefined = undefined,
        errorCode: string = ''
    ) {

        const findIndex = this.askList.findIndex((item) => item.key === key);
        const updateTime = new Date().getTime();

        if (findIndex > -1) {
            this.askList[findIndex].state = state;
            this.askList[findIndex].updateTime = updateTime;
            this.askList[findIndex].answerMarkdown = (this.askList[findIndex].answerMarkdown! || '') + (answerMarkdown || '');
            this.askList[findIndex].streamDone = streamState;
            this.askList[findIndex].errorCode = errorCode;
        } else if (questionContent) {
            console.time('X');
            this.askList.push({
                key,
                state,
                streamDone: STREAM_STATE.APPENDING,
                questionContent,
                answerMarkdown,
                updateTime: $updateTime ? $updateTime : updateTime,
                errorCode,
                inputTime: $updateTime ? $updateTime : updateTime
            })
            console.timeEnd('X');
        }
    }

    public async initFavorite() {
        await this.getFavoriteCount();
    }

    public async getFavorite() {
        this.favoriteList = await this.favoriteModel.getList();
    }

    public async getFavoriteCount() {
        this.favoriteCount = await this.favoriteModel.getCount();
        return this.favoriteCount;
    }

    public async deleteFavorite(id: number | undefined) {

        this.trackEventService.send('deleteFavorite')

        if (!id) {
            if (handleIsTauri()) {
                await message('缺少必要的删除id', {title: '', type: 'info'});
            } else {
                this.modalService.create(`缺少必要的删除id`, {
                    confirm: () => {
                    }
                });
            }

            return;
        }

        if ((await this.favoriteModel.favoriteDB.TABLE_FAVORITE.where({id}).count()) !== 0) {
            await this.favoriteModel.delete(id);
            await this.getFavorite();
            await this.getFavoriteCount();
        } else {
            this.toastService.create('收藏成功')
        }

    }

    public async favoriteHandle(item: AskFavoriteListItem) {
        const data: AskFavoriteListItem = {
            key: item.key!,
            id: item.id!,
            state: item.state,
            questionContent: item.questionContent,
            answerContent: item.answerContent,
            answerMarkdown: item.answerMarkdown,
            updateTime: item.updateTime,
            inputTime: item.inputTime,
            streamDone: STREAM_STATE.DONE
        };
        if ((await this.favoriteModel.favoriteDB.TABLE_FAVORITE.where({questionContent: item.questionContent}).count()) !== 0) {
            this.toastService.create('该问题已经收藏过了.')

            return;
        }
        await this.favoriteModel.add(data);
        await this.getFavoriteCount();
        this.toastService.create('收藏成功')

    }

    public async tabStateChange(state: TAB_STATE) {

        this.trackEventService.send('tabStateChange')

        this.tabState = state;
        this.favoriteLoading = true;
        if (state === TAB_STATE.FAVORITE_MODE) {
            await this.getFavorite();
            await this.getFavoriteCount();
            this.favoriteLoading = false;
        }
    }

    // 发送
    public async send() {

        // 不是done状态将不允许发送下一条记录
        if (this.newTempDataAppEndState !== STREAM_STATE.DONE) {
            this.toastService.create('上一个问题还在响应中...');
            return;
        }

        // 如果缺少秘钥
        if (!await this.checkConfigAppKey()) {
            return;
        }

        // 如果未输入搜索关键词
        if (!this.searchKey) {
            return;
        }

        this.isPromptMode = false;
        // const address = 'http://localhost:6200/q/2';
        const address = 'https://chatgpt.kka.pw/q/2';
        const timestamp = new Date().getTime();
        const id = `ASK-${timestamp}`;
        // 生成上下文
        this.newTempDataAppEndState = STREAM_STATE.PENDING;
        this.newTempDataQuestionContent = this.searchKey;

        this.trackEventService.send('send');

        this.worker.postMessage({
            eventName: 'request',
            message: {
                key: id,
                address,
                questionContent: this.searchKey,
                appKey: this.configService.CONFIG.BASE_SECRET_KEY,
                askContext: await this.contextService.generateRequestContext(this.searchKey)
            }
        });
    }

    public async favoriteClearAll() {
        await this.favoriteModel.clear();
        this.favoriteList = await this.favoriteModel.getList();
    }

    public async askListClearAll() {
        this.tabState = TAB_STATE.ASK_MODE;
        this.searchKey = '';
        this.askList = [];
        this.newTempDataAppEndState = STREAM_STATE.DONE;
        this.newTempDataQuestionContent = '';
    }
}
