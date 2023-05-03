import {ElementRef, EventEmitter, Injectable} from '@angular/core';
import {message, confirm} from "@tauri-apps/api/dialog";
import Mousetrap from 'mousetrap';
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {FavoriteDatabase, AskFavoriteListItem, FavoriteModel, AskFavoriteList} from "./app.model";
import {handleIsTauri} from "../main";
import config from '../../src-tauri/tauri.conf.json';
import {ModalService} from "../component/unit/modal/modal.service";
import {ToastService} from "../component/unit/toast/toast.service";
import {HistoryService} from "../component/histroy/history.service";
import {ContextService} from "../component/context/context.service";

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
    public appKey = localStorage.getItem('APP-KEY');
    public searchKey = '';
    public isOpenSettingPanel = false;
    public isOpenHistorySearchListPanel = false;
    public updateAppKeyHandleTimer: any;
    public appKeyWidgetRef: ElementRef<HTMLTextAreaElement> | undefined;
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
    ) {
        this.appKey = localStorage.getItem('APP-KEY') || '';
        this.initShortcutKeyBind();
        this.initFavorite();
        this.initWorkerMessageListen();
    }

    public initWorkerMessageListen() {

        this.worker.addEventListener('message', async ({data}) => {

            // 请求准备开始
            if (data.eventName === 'requestStart') {
                await this.historyService.update(data.message.questionContent);
                this.clearSearchKey();
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
                this.updateAskList(key, answerMarkdown, questionContent, HISTORY_LIST_ITEM_STATE.FINISH,  STREAM_STATE.DONE);
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

    // 更新密钥,将密钥写入本地存储
    updateAppKeyHandle(value: string) {
        this.appKey = value.trim();
        this.updateAppKeyHandleTimer = setTimeout(() => {
            localStorage.setItem('APP-KEY', this.appKey!);
        }, 500);
    }

    // 验证是否有配置密钥，如若没有将弹出tauri提供的原生弹窗
    public async checkConfigAppKey() {
        let ok = true;
        if (!this.appKey) {
            if (handleIsTauri()) {
                await message(`未配置GPT密钥，请先配置GPT密钥`, {type: 'warning', title: 'GPT-GUI'});
                this.isOpenSettingPanel = true;
            } else {
                this.modalService.create(`未配置GPT密钥，请先配置GPT密钥`, {
                    confirm: () => {
                        this.isOpenSettingPanel = true;
                    }
                });
            }
            ok = false;
            setTimeout(() => {
                this.appKeyWidgetRef?.nativeElement?.focus();
            }, 100);
        }
        return ok;
    }

    // 清理搜索关键字（一般在发送问题之后）
    public clearSearchKey() {
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
        const response = await this.favoriteModel.getList();
        this.favoriteList = response;
    }

    public async getFavoriteCount() {
        setTimeout(async () => {
            this.favoriteCount = await this.favoriteModel.getListCount();
        }, 200)
    }

    public async deleteFavorite(id: number | undefined) {

        if (!id) {
            if (handleIsTauri()) {
                await message('缺少必要的删除id', {title: '', type: 'info'});
            } else {
                this.modalService.create(`缺少必要的删除id`, {
                    confirm: () => {
                        this.isOpenSettingPanel = true;
                    }
                });
            }

            return;
        }

        if ((await this.favoriteModel.favoriteDB.favorite.where({id}).count()) !== 0) {
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
        if ((await this.favoriteModel.favoriteDB.favorite.where({questionContent: item.questionContent}).count()) !== 0) {
            this.toastService.create('该问题已经收藏过了.')

            return;
        }
        await this.favoriteModel.add(data);
        await this.getFavoriteCount();
        this.toastService.create('收藏成功')

    }

    public async tabStateChange(state: TAB_STATE) {
        this.tabState = state;
        this.favoriteLoading = true;
        if (state === TAB_STATE.FAVORITE_MODE) {
            await this.getFavorite();
            await this.getFavoriteCount();
            this.favoriteLoading = false;
        }
    }

    public get sortAskList() {
        let askList = this.askList;
        return askList.sort((itemA, itemB) => {
            return itemA.inputTime! - itemB.inputTime!
        });
    }

    public get sortFavoriteList() {
        let favoriteList = this.favoriteList;
        return favoriteList.sort((itemA, itemB) => {
            if (!itemB.inputTime || !itemA.inputTime) {
                return 1;
            }
            return itemB.inputTime - itemA.inputTime;
        });
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

        this.worker.postMessage({
            eventName: 'request',
            message: {
                key: id,
                address,
                questionContent: this.searchKey,
                appKey: this.appKey,
                askContext: await this.contextService.generateRequestContext(this.searchKey)
            }
        });
    }
}
