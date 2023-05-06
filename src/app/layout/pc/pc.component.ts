import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService, HISTORY_LIST_ITEM_STATE, STREAM_STATE, TAB_STATE } from "../../app.service";
import { MESSAGE_CARD_USE_TYPE } from "../../../component/advanced/message_card/messageCard.component";
import { ContextService } from "../../../component/advanced/context/context.service";
import { PlatformUtilService } from "../../../utils/platform.util";
import { ConfigService } from "../../../config/config.service";
import { SettingService } from 'src/component/advanced/setting/setting.service';

@Component({
  selector: 'app-pc',
  templateUrl: './pc.component.html',
  styleUrls: ['./pc.component.scss', '../layout-preview.scss']
})

export class LayoutForPcComponent implements OnInit {

  public MESSAGE_CARD_USE_TYPE = MESSAGE_CARD_USE_TYPE;
  public TAB_STATE = TAB_STATE;

  constructor(
    public platformUtilService: PlatformUtilService,
    public contextService: ContextService,
    public appService: AppService,
    public configService: ConfigService,
    public settingService: SettingService,
  ) {

  }

  public get SHOW_NO_DATA() {
    return this.appService.newTempDataAppEndState === STREAM_STATE.DONE && this.appService.askList.length === 0;
  }

  ngOnInit() {
  }

  historySelectedEventHandle(value: string) {
    this.appService.searchKey = value;
  }
}
