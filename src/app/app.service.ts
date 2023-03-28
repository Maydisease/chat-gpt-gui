import {ElementRef, Injectable} from '@angular/core';
import {invoke} from "@tauri-apps/api/tauri";
import {message} from "@tauri-apps/api/dialog";
import {HttpClient} from "@angular/common/http";
import Mousetrap from 'mousetrap';
import showdown from 'showdown';
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {FavoriteDatabase, FavoriteItem, FavoriteModel} from "./app.model";
import {handleIsTauri} from "../main";
import config from '../../src-tauri/tauri.conf.json';
import {ModalService} from "../component/modal/modal.service";

declare var Prism: any;

export enum TAB_STATE {
  FAVORITE_MODE,
  ASK_MODE
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

export interface AskDataListItem {
  id: string,
  questionContent: string,
  answerContent?: string,
  answerMarkdown?: string,
  state: HISTORY_LIST_ITEM_STATE,
  updateTime: number;
  inputTime: number;
}

export type AskDataList = AskDataListItem[];

export interface HistoryListItem {
  id: string,
  type: HISTORY_LIST_ITEM_TYPE,
  data: string | undefined,
  state: HISTORY_LIST_ITEM_STATE,
  updateTime: number;
}

export type HistoryList = HistoryListItem[];


export interface HistorySearchKeyListItem {
  key: string;
  selected: boolean;
  state: HISTORY_LIST_ITEM_STATE;
}

export type HistorySearchKeyList = HistorySearchKeyListItem[];


@Injectable({providedIn: 'root'})
export class AppService {

  public version = config.package.version;

  public favoriteDb = new FavoriteDatabase();

  public tabState: TAB_STATE = TAB_STATE.ASK_MODE;
  public favoriteList: FavoriteItem[] = [];
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
  public HistorySearchKeyListSelectedIndex = 0;
  public historySearchKeyList: HistorySearchKeyList = [];
  public askList: AskDataList = [];

  constructor(
    public modalService: ModalService,
    public httpClient: HttpClient,
    public favoriteModel: FavoriteModel,
  ) {
    this.appKey = localStorage.getItem('APP-KEY') || '';
    this.initShortcutKeyBind();
    this.initHistorySearchKeyList();
    this.initFavorite();
  }


  // 每次有答案返回时，将容器的滚动条滚动至最底部
  public moveHistoryContainerScrollToBottom() {
    setTimeout(() => {
      this.historyElementRef?.nativeElement.scrollTo({behavior: 'smooth', top: 999999999})
    }, 200);
  }

  // 初始化快捷键绑定
  public initShortcutKeyBind() {
    Mousetrap.bind('command+f', () => {
      this.searchWidgetRef?.nativeElement.focus();
    });
  }

  // 初始化历史搜索关键字列表（从本地存储读取至内存中）
  public initHistorySearchKeyList() {
    const historySearchKeyList = localStorage.getItem('HISTORY-SEARCH-KEY-LIST');
    if (historySearchKeyList) {
      try {
        this.historySearchKeyList = JSON.parse(historySearchKeyList);
      } catch (err) {
      }
    }
  }

  // 更新密钥,将密钥写入本地存储
  updateAppKeyHandle(value: string) {
    this.appKey = value.trim();
    this.updateAppKeyHandleTimer = setTimeout(() => {
      localStorage.setItem('APP-KEY', this.appKey!);
    }, 500);
  }

  // 渲染高亮（针对答案中的代码做高亮展示）
  renderHighlight(htmlString: string) {
    const htmlElement = new DOMParser().parseFromString(htmlString, 'text/html');
    htmlElement.querySelectorAll('pre code').forEach((item) => {
      const preElement = item.closest('pre') as HTMLElement;
      const langString = item.getAttribute('class');
      let languageName = '';
      if (preElement && langString && langString.indexOf('language-') === 0) {
        languageName = langString.replace('language-', '');
        try {
          const highlightHtml = Prism.highlight(item.textContent, Prism.languages[languageName], languageName);
          preElement.innerHTML = highlightHtml;
        } catch (err) {

        }

      }
    });

    return htmlElement.querySelector('body')!.innerHTML;
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
  public updateAskList(id: string, answerContent: string | undefined, answerMarkdown: string | undefined, questionContent: string | undefined, state: HISTORY_LIST_ITEM_STATE) {
    const findIndex = this.askList.findIndex((item) => item.id === id && item.state === HISTORY_LIST_ITEM_STATE.PENDING);
    const updateTime = new Date().getTime();

    if (findIndex > -1) {
      this.askList[findIndex].state = state;
      this.askList[findIndex].answerContent = answerContent;
      this.askList[findIndex].updateTime = updateTime;
      this.askList[findIndex].answerMarkdown = answerMarkdown;
    } else if (questionContent) {
      this.askList.push({
        id,
        state,
        questionContent,
        updateTime,
        inputTime: new Date().getTime()
      })
    }
    this.moveHistoryContainerScrollToBottom();
  }


  // 更新历史搜索关键字
  public updateHistorySearchKeyList(item: HistorySearchKeyListItem) {

    this.historySearchKeyList.some((item, index) => {
      if (item.selected) {
        this.historySearchKeyList[index].selected = false;
        this.HistorySearchKeyListSelectedIndex = 0;
        return true;
      } else {
        return false;
      }
    })

    // 存在相同的
    if (this.historySearchKeyList.find((_item) => _item.key === item.key)) {
      return;
    }

    // 只保留最近的5条记录
    if (this.historySearchKeyList.length > 5) {
      this.historySearchKeyList = this.historySearchKeyList.reverse().splice(0, 5).reverse();
    }

    // 将历史搜索关键字同步至本地存储
    this.historySearchKeyList.push(item);
    localStorage.setItem('HISTORY-SEARCH-KEY-LIST', JSON.stringify(this.historySearchKeyList));

  }


  // 支持使用键盘上下箭头来选择历史搜索关键字记录
  public updateHistorySearchKeyListSelectedIndex(code: string) {

    // 如果没有历史搜索关键词时，将跳出
    if (this.historySearchKeyList.length === 0) {
      return;
    }

    // 每一次使用历史搜索都重置上次的选中状态
    this.historySearchKeyList.map((item, index) => {
      this.historySearchKeyList[index].selected = false;
    });

    // 初次默认打开搜索面板
    if (!this.isOpenHistorySearchListPanel && this.historySearchKeyList.length > 0) {
      this.HistorySearchKeyListSelectedIndex = this.historySearchKeyList.length - 1;
      this.isOpenHistorySearchListPanel = true;
      this.historySearchKeyList[this.HistorySearchKeyListSelectedIndex].selected = true;
      return;
    }

    if (code === 'ArrowUp') {
      this.HistorySearchKeyListSelectedIndex = this.HistorySearchKeyListSelectedIndex - 1;
    }

    if (code === 'ArrowDown') {
      this.HistorySearchKeyListSelectedIndex = this.HistorySearchKeyListSelectedIndex + 1;
    }

    if (this.HistorySearchKeyListSelectedIndex === -1) {
      this.HistorySearchKeyListSelectedIndex = 0;
    }

    if (this.HistorySearchKeyListSelectedIndex >= this.historySearchKeyList.length) {
      this.HistorySearchKeyListSelectedIndex = this.historySearchKeyList.length - 1;
    }

    if (this.historySearchKeyList[this.HistorySearchKeyListSelectedIndex]) {
      this.historySearchKeyList[this.HistorySearchKeyListSelectedIndex].selected = true;
    }

  }

  //清理历史搜索记录
  cleanHistorySearchKeyList(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.isOpenHistorySearchListPanel = false;
    this.historySearchKeyList = [];
    this.HistorySearchKeyListSelectedIndex = 0;
    localStorage.removeItem('HISTORY-SEARCH-KEY-LIST');
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
      if (handleIsTauri()) {
        await message('无效的删除ID', {title: '', type: 'info'});
      } else {
        this.modalService.create('无效的删除ID');
      }

    }

  }

  public async favoriteHandle(item: AskDataListItem) {
    const data: FavoriteItem = {
      questionContent: item.questionContent,
      answerContent: item.answerContent,
      updateTime: item.updateTime,
      inputTime: item.inputTime
    };
    if ((await this.favoriteModel.favoriteDB.favorite.where({questionContent: item.questionContent}).count()) !== 0) {
      if (handleIsTauri()) {
        await message('该问题已收藏过', {title: '', type: 'info'});
      } else {
        this.modalService.create('该问题已收藏过');
      }

      return;
    }
    await this.favoriteModel.add(data);
    await this.getFavoriteCount();
    if (handleIsTauri()) {
      await message('收藏成功', {title: '', type: 'info'});
    } else {
      this.modalService.create('收藏成功');
    }

  }

  // 发送
  public async send() {
    // 如果缺少秘钥
    if (!await this.checkConfigAppKey()) {
      return;
    }

    // 如果未输入搜索关键词
    if (!this.searchKey) {
      return;
    }

    const address = 'https://chatgpt.kka.pw/q';
    const timestamp = new Date().getTime();
    const id = `ASK-${timestamp}`;
    const searchKeyClone = this.searchKey;
    this.updateAskList(id, undefined, undefined, searchKeyClone, HISTORY_LIST_ITEM_STATE.PENDING);

    //  追加对话的上下文
    const context: string[] = [];
    if (this.askList && this.askList.length > 0) {

      const descAskList = this.askList.sort((itemA, itemB) => {
        return itemA.inputTime - itemB.inputTime;
      });
      console.log('xxxx', descAskList)
      descAskList.map((item) => {
        if (item.answerMarkdown) {
          context.push(item.answerMarkdown);
        }
      })
    }

    this.httpClient.post(address, {
      "content": this.searchKey,
      "appKey": this.appKey,
      context,
    }, {
      headers: {
        'content-type': 'application/json'
      }
    }).subscribe(async (result: any) => {
        // 如果返回的code=1那则代表成功
        if (result && result.code === 1) {
          let markdown = result.content;
          let html = '';
          if (handleIsTauri()) {
            html = await invoke("greet", {name: markdown});
          } else {
            const converter = new showdown.Converter();
            html = converter.makeHtml(markdown);
          }
          html = this.renderHighlight(html);
          this.updateAskList(id, html, markdown, undefined, HISTORY_LIST_ITEM_STATE.FINISH);

          this.updateHistorySearchKeyList({
            key: searchKeyClone,
            state: HISTORY_LIST_ITEM_STATE.FINISH,
            selected: false
          });
          this.autosizeRef?.reset();
        }
        // 否则就认为失败
        else {
          this.updateAskList(id, result.message, undefined, undefined, HISTORY_LIST_ITEM_STATE.FAIL);
          this.updateHistorySearchKeyList({
            key: searchKeyClone,
            state: HISTORY_LIST_ITEM_STATE.FAIL,
            selected: false
          });
        }
      },
      // 请求出错，一般是网络问题
      (error) => {
        this.updateAskList(id, error.message, undefined, undefined, HISTORY_LIST_ITEM_STATE.FAIL);
        this.updateHistorySearchKeyList({
          key: searchKeyClone,
          state: HISTORY_LIST_ITEM_STATE.FAIL,
          selected: false
        });
      });
    this.clearSearchKey();
  }
}
