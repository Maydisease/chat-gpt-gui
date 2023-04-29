import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router'
import {Md5Pipe} from "../pipes/md5.pipe";
import {Md2HtmlPipe} from "../pipes/md2Html.pipe";
import {BodyEventDirective} from "../directive/bodyEvent.directive";
import {LayoutForPcComponent} from "./layout/pc/pc.component";
import {MobileComponent} from "./layout/mobile/mobile.component";
import {DateFormatPipe} from "../pipes/dateFormat.pipe";
import {AppComponent} from "./app.component";
import {NoDataComponent} from "../component/no_data/noData.component";
import {ModalComponent} from "../component/modal/modal.component";
import {PromptComponent} from "../component/prompt/prompt.component";
import {SendActionDirective} from "../directive/sendAction.directive";
import {SubstringPipe} from "../pipes/substring.pipe";
import {LayoutSplitterDirective} from "../directive/layoutSplitter.directive";
import {MessageCardComponent} from "../component/message_card/messageCard.component";
import {IconsModule} from "../component/icons/icons.module";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {TextFieldModule} from "@angular/cdk/text-field";
import {OverlayModule} from "@angular/cdk/overlay";
import {BrowserModule} from "@angular/platform-browser";
import {LayoutComponent} from "./layout/layout.component";
import {ClipboardModule} from '@angular/cdk/clipboard';
import {InitTaskResolveService} from "../resolve/initTask-resolve.service";
import {HljsDirective} from "../component/message_card/directive/hljs.directive";
import {ObserversModule} from "@angular/cdk/observers";
import {PullDownDirective} from "../component/message_card/directive/pullDown.directive";
import {NewTempDirective} from "../component/message_card/directive/newTemp.directive";
import {NewTempComponent} from "../component/message_card/components/newTemp.component";
import {ContextComponent} from "../component/context/context.component";
import {CheckboxComponent} from "../component/unit/checkbox/checkbox.component";
import {CheckboxClickHandleDirective} from "../component/unit/checkbox/checkboxClickHandle.directive";
import {CheckboxListDirective} from "../component/unit/checkbox/checkboxList.directive";

const routes: Routes = [
    // {path: '', pathMatch: 'full'},
    {path: '', component: LayoutComponent, resolve: [InitTaskResolveService]},
    {path: '**', redirectTo: ''}
]

@NgModule({
    declarations: [
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
        CheckboxListDirective
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
