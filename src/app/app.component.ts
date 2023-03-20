import {AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild} from "@angular/core";
import {invoke} from "@tauri-apps/api/tauri";
import {checkUpdate, installUpdate, onUpdaterEvent} from '@tauri-apps/api/updater';
import {relaunch} from '@tauri-apps/api/process';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {AppService, HISTORY_LIST_ITEM_STATE, TAB_STATE} from "./app.service";
import {getTauriVersion, getVersion} from "@tauri-apps/api/app";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('autosize') autosizeRef: CdkTextareaAutosize | undefined;
  @ViewChild('appKeyWidgetRef', {static: true}) appKeyWidgetRef: ElementRef<HTMLTextAreaElement> | undefined;
  @ViewChild('searchWidgetRef', {static: true}) searchWidgetRef: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('historyElementRef', {static: true}) historyElementRef: ElementRef<HTMLElement> | undefined;

  public HISTORY_LIST_ITEM_STATE = HISTORY_LIST_ITEM_STATE;
  public TAB_STATE = TAB_STATE;
  public searchWidgetIsFocus = false;
  public isUsedHistorySearchKeying = false;

  constructor(
    public appService: AppService,
    private _ngZone: NgZone
  ) {

  }

  // 是否展示问题输入框内的快捷键提示文案
  get displaySearchWidgetTips() {
    return !this.appService.searchKey;
  }

  async ngOnInit() {
    const unlisten = await onUpdaterEvent(({ error, status }) => {
      console.log('Updater event', error, status);
    });

// you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
    unlisten();

    // await installUpdate();
    // console.log(10000)
    //
    // checkUpdate().then((res) => {
    //   console.log('res')
    // }).catch((err) => {
    //   console.log('err:', err)
    // }).finally(() => {
    //   console.log('finally')
    // })



    // fetch('https://raw.githubusercontent.com/Maydisease/chat-gpt-gui/gh-pages/updater.json').then((res) => res.json()).then(async (re) => {
    //   console.log('res', re, await getVersion())
    // })


    try {
      console.log('checkUpdate:');
      const {shouldUpdate, manifest} = await checkUpdate();
      console.log('shouldUpdate:', shouldUpdate);
      console.log('manifest:', manifest);
      if (shouldUpdate) {
        // display dialog
        await installUpdate()
        // install complete, restart the app
        await relaunch()
      }
    } catch (error) {
      console.log(error)
    }

    this.appService.appKeyWidgetRef = this.appKeyWidgetRef;
    this.appService.searchWidgetRef = this.searchWidgetRef;
    this.appService.historyElementRef = this.historyElementRef;
    this.appService.autosizeRef = this.autosizeRef;
  }

  // 在页面渲染完成后，将与tauri通信，告知已经渲染完毕
  public async ngAfterViewInit() {
    await invoke("init_process", {});
  }

  // 搜索关键字变更
  searchKeyChangeHandle(value: string) {
    this.autosizeRef!.reset();
    this.isUsedHistorySearchKeying = false;
    if (this.appService.searchKey) {
      this.appService.isOpenHistorySearchListPanel = false;
    }
  }

  // 发送问题
  public send() {
    this.appService.send();
  }

  // 初次触发打开历史关键字面板，并移动选中关键字
  public useHistorySearchHandle(code: string) {

    if (this.appService.searchKey && !this.isUsedHistorySearchKeying) {
      return;
    }

    this.appService.updateHistorySearchKeyListSelectedIndex(code);
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
      this.autosizeRef?.reset();
    }
  }

  // 历史搜索面板销毁事件处理
  public historySearchListPanelDetachHandle() {
    this.appService.isOpenHistorySearchListPanel = false;
  }

  public searchKeyBlur() {
    setTimeout(() => {
      this.searchWidgetIsFocus = false;
      this.appService.isOpenHistorySearchListPanel = false;
    }, 100);
  }

  // 配置面板展示/关闭事件处理
  public settingPanelDisplayHandle() {
    this.appService.isOpenSettingPanel = !this.appService.isOpenSettingPanel;
  }

  public async tabStateChange(state: TAB_STATE) {
    this.appService.tabState = state;
    if (state === TAB_STATE.FAVORITE_MODE) {
      await this.appService.getFavorite();
      await this.appService.getFavoriteCount();
    }
  }
}
