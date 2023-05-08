import {Injectable, Injector} from "@angular/core";
import {Overlay, OverlayRef, ScrollStrategy, ScrollStrategyOptions,} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";
import {ContextComponent} from "./context.component";
import {AskContextItem, AskContextItemList, ContextModel} from "./context.model";
import {ChatGptTokensUtil} from "../../../utils/chatGptTokens.util";
import {handleIsTauri} from "../../../main";
import {confirm} from "@tauri-apps/api/dialog";
import {ModalService} from "../../unit/modal/modal.service";
import {SettingService} from "../setting/setting.service";
import {ConfigService} from "../../../config/config.service";
import {TrackEventService} from "../../../services/trackEvent.service";

export interface ContextContextBase {
    message?: string;
    $m?: {
        detach: (key: number) => void;
        key: number;
    };
    $event: Config
}

interface Config {
    cancelText?: string,
    cancel?: () => void
    confirmText?: string,
    confirm?: () => void
}

@Injectable({providedIn: "root"})
export class ContextService {
    public scrollStrategy: ScrollStrategy;
    public list = new Map<number, OverlayRef>();
    public count = 0;

    public askContextList: AskContextItemList = [];

    public askContextTotalContext = 0;

    constructor(
        public modalService: ModalService,
        private overlay: Overlay,
        private readonly scrollStrategyOptions: ScrollStrategyOptions,
        public contextModel: ContextModel,
        public settingService: SettingService,
        public configService: ConfigService,
        public trackEventService: TrackEventService,
    ) {
        this.scrollStrategy = scrollStrategyOptions.block();
        this.initAskContext();
    }

    static createInjector<T>(data: T): Injector {
        return Injector.create({
            providers: [{provide: "context", useValue: data}],
        });
    }

    // 创建
    public create(config: Config = {}): [number, OverlayRef] {

        this.trackEventService.send('openContextPage');

        this.count++;
        const overlayRef = this.overlay.create({
            ...{
                height: "0",
                width: "0",
                hasBackdrop: false,
                disableClose: false,
                backdropClass: "modal-backdrop-opacity",
                scrollStrategy: this.scrollStrategy,
                positionStrategy: this.overlay
                    .position()
                    .global()
                    .centerHorizontally()
                    .centerVertically(),
            },
        });

        this.list.set(this.count, overlayRef);
        const component = ContextComponent;
        const context: ContextContextBase = {
            $event: {
                cancelText: config.cancelText,
                cancel: config.cancel,
                confirm: config.confirm,
                confirmText: config.confirmText
            }
        };
        context.$m = {
            detach: this.detach.bind(this),
            key: this.count,
        };
        const portal = new ComponentPortal(
            component,
            null,
            ContextService.createInjector(context)
        );

        if (portal) {
            overlayRef.attach(portal);
        }

        return [this.count, overlayRef];
    }

    public getAll() {
        return this.list;
    }

    // 销毁
    public detach(key: number) {
        if (this.list.has(key)) {
            this.list.get(key)!.detach();
            this.list.delete(key);
        }
    }

    public async switchAskContextEnableStateHandle() {

        this.trackEventService.send('switchAskContextEnableStateHandle')

        if (handleIsTauri()) {
            const confirmed = await confirm('确定切换上下文状态吗？开启上下文后Chat GTP将会更好的结合你上次的问题与答案，聊天体验将会变得更好，但同时也更加耗费Tokens。', 'GPT-GUI');
            if (confirmed) {
                if (this.configService.CONFIG.CONTEXT_ENABLE) {
                    await this.settingService.contextEnableChangeHandle(false)
                } else {
                    await this.settingService.contextEnableChangeHandle(true)
                }
            }
        } else {
            this.modalService.create(`确定切换上下文状态吗？开启上下文后Chat GTP将会更好的结合你上次的问题与答案，聊天体验将会变得更好，但同时也更加耗费Tokens。`, {
                confirm: async () => {
                    if (this.configService.CONFIG.CONTEXT_ENABLE) {
                        await this.settingService.contextEnableChangeHandle(false)
                    } else {
                        await this.settingService.contextEnableChangeHandle(true)
                    }
                },
                cancel: () => {

                }
            });
        }

    }

    public async initAskContext() {
        this.askContextList = await this.getList();
        await this.computedTotalToken();
    }

    async autoCutContext(arr: AskContextItemList, questionTokenNum: number) {
        arr = JSON.parse(JSON.stringify(arr));
        const maxToken = 3000 - questionTokenNum;
        let total = 0;

        for (let i = 0; i < arr.length; i++) {
            total += arr[i].token!;
        }

        if (total < maxToken) {
            return arr;
        }

        for (let i = 0; i < arr.length; i++) {
            const token = arr[i].token!;
            if (total > maxToken) {
                total -= token;
                await this.contextModel.delete(arr[i].id!)
            }
        }
        return this.contextModel.getList();
    }

    public async generateRequestContext(questionContent: string) {

        const context: { role: string, content: string }[] = [];

        // 如果开启了上下文
        if (this.configService.CONFIG.CONTEXT_ENABLE) {

            // 如果开启了上下文裁剪的话
            this.askContextList = await this.getList();
            if (this.configService.CONFIG.CONTEXT_ENABLE_AUTO_CUT) {
                const questionTokenNum = ChatGptTokensUtil.tokenLen(questionContent);
                this.askContextList = await this.autoCutContext(this.askContextList, questionTokenNum);
            }

            await this.computedTotalToken();
            this.askContextList.map((item: any) => {
                item.list.map((chatItem: any) => {
                    context.push({role: chatItem.role, content: chatItem.content});
                })
            });
        }

        context.push({
            content: questionContent,
            role: 'user',
        });

        return context;

    }

    async computedTotalToken() {
        this.askContextTotalContext = 0;
        this.askContextList = await this.getList();
        for (let i = 0; i < this.askContextList.length; i++) {
            this.askContextTotalContext += this.askContextList[i].token!;
        }
    }

    public async updateContext(question: string, answer: string) {
        const questionToken = ChatGptTokensUtil.tokenLen(question);
        const answerToken = ChatGptTokensUtil.tokenLen(answer);
        const itemToken = questionToken + answerToken;

        const payload: AskContextItem = {
            list: [
                {
                    role: 'user',
                    content: question,
                    token: questionToken
                },
                {
                    role: 'assistant',
                    content: answer,
                    token: answerToken
                }
            ],
            updateTime: new Date().getTime(),
            token: itemToken
        }

        await this.contextModel.add(payload);
        this.askContextList = await this.getList();
        await this.computedTotalToken();
    }

    public async getList() {
        return await this.contextModel.getList();
    }

    public async delete(id: number) {
        await this.contextModel.delete(id);
    }

    public async getCount() {
        return this.contextModel.getCount();
    }

    public async clearAll() {
        await this.contextModel.clear();
        this.askContextList = await this.getList();
        await this.computedTotalToken();
    }

}
