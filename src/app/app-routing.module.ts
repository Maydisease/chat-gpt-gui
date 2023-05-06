import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { Md5Pipe } from "../pipes/md5.pipe";
import { Md2HtmlPipe } from "../pipes/md2Html.pipe";
import { BodyEventDirective } from "../directive/bodyEvent.directive";
import { LayoutForPcComponent } from "./layout/pc/pc.component";
import { MobileComponent } from "./layout/mobile/mobile.component";
import { DateFormatPipe } from "../pipes/dateFormat.pipe";
import { AppComponent } from "./app.component";
import { NoDataComponent } from "../component/advanced/no_data/noData.component";
import { ModalComponent } from "../component/unit/modal/modal.component";
import { PromptComponent } from "../component/advanced/prompt/prompt.component";
import { SendActionDirective } from "../directive/sendAction.directive";
import { SubstringPipe } from "../pipes/substring.pipe";
import { LayoutSplitterDirective } from "../directive/layoutSplitter.directive";
import { MessageCardComponent } from "../component/advanced/message_card/messageCard.component";
import { IconsModule } from "../component/unit/icons/icons.module";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { TextFieldModule } from "@angular/cdk/text-field";
import { OverlayModule } from "@angular/cdk/overlay";
import { BrowserModule } from "@angular/platform-browser";
import { LayoutComponent } from "./layout/layout.component";
import { ClipboardModule } from '@angular/cdk/clipboard';
import { InitTaskResolveService } from "../resolve/initTask-resolve.service";
import { HljsDirective } from "../component/advanced/message_card/directive/hljs.directive";
import { ObserversModule } from "@angular/cdk/observers";
import { PullDownDirective } from "../component/advanced/message_card/directive/pullDown.directive";
import { NewTempDirective } from "../component/advanced/message_card/directive/newTemp.directive";
import { NewTempComponent } from "../component/advanced/message_card/components/newTemp.component";
import { ContextComponent } from "../component/advanced/context/context.component";
import { CheckboxComponent } from "../component/unit/checkbox/checkbox.component";
import { CheckboxClickHandleDirective } from "../component/unit/checkbox/checkboxClickHandle.directive";
import { CheckboxListDirective } from "../component/unit/checkbox/checkboxList.directive";
import { TextLoadingComponent } from "../component/unit/text_loading/textLoading.component";
import { HistoryComponent } from "../component/advanced/histroy/history.component";
import { OutsideClickDirective } from "../directive/outsideClick.directive";
import { SwitchComponent } from "../component/unit/switch/switch.component";
import { SettingComponent } from "../component/advanced/setting/setting.componet";
import { UButtonComponent } from "../component/unit/button/button.component";
import { PopComponent } from "../component/unit/pop/pop.component";
import { PopDirective } from "../component/unit/pop/pop.directive";
import { AsDirective } from 'src/directive/as.directive';

const routes: Routes = [
  { path: '', component: LayoutComponent, resolve: [InitTaskResolveService] },
  { path: '**', redirectTo: '' }
]

@NgModule({
  declarations: [
    AsDirective,
    PopDirective,
    PopComponent,
    UButtonComponent,
    SettingComponent,
    CheckboxComponent,
    ContextComponent,
    NewTempComponent,
    NewTempDirective,
    Md5Pipe,
    HljsDirective,
    Md2HtmlPipe,
    PullDownDirective,
    BodyEventDirective,
    LayoutForPcComponent,
    MobileComponent,
    DateFormatPipe,
    AppComponent,
    NoDataComponent,
    ModalComponent,
    PromptComponent,
    SendActionDirective,
    SubstringPipe,
    LayoutComponent,
    LayoutSplitterDirective,
    MessageCardComponent,
    CheckboxClickHandleDirective,
    CheckboxListDirective,
    TextLoadingComponent,
    HistoryComponent,
    SwitchComponent,
    OutsideClickDirective
  ],
  imports: [
    ObserversModule,
    BrowserModule,
    FormsModule,
    ClipboardModule,
    HttpClientModule,
    TextFieldModule,
    OverlayModule,
    IconsModule,
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      enableTracing: false
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor() {
  }
}
