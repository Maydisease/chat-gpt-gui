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
import {InitTaskResolveService} from "../resolve/initTask-resolve.service";
import {HljsDirective} from "../component/message_card/directive/hljs.directive";

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'layout'},
    {path: '', resolve: [], children: []},
    {path: 'layout', component: LayoutComponent, resolve: [InitTaskResolveService]},
    {path: '**', redirectTo: 'layout'}
]

@NgModule({
    declarations: [
        Md5Pipe,
        HljsDirective,
        Md2HtmlPipe,
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
        MessageCardComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
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
