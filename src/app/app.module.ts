import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {OverlayModule} from '@angular/cdk/overlay';

import {AppComponent} from "./app.component";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {TextFieldModule} from '@angular/cdk/text-field';
import {SendActionDirective} from "../directive/sendAction.directive";
import {SubstringPipe} from "../pipes/substring.pipe";
import {IconsModule} from "../component/icons/icons.module";
import {ModalComponent} from "../component/modal/modal.component";
import {DateFormatPipe} from "../pipes/dateFormat.pipe";
import {LayoutSplitterDirective} from "../directive/layoutSplitter.directive";
import {MobileComponent} from "./layout/mobile/mobile.component";
import {LayoutForPcComponent} from "./layout/pc/pc.component";
import {LayoutService} from "./layout/layout.service";
import {AppService} from "./app.service";
import {PromptComponent} from "../component/prompt/prompt.component";
import {Md5Pipe} from "../pipes/md5.pipe";

@NgModule({
    declarations: [
        Md5Pipe,
        LayoutForPcComponent,
        MobileComponent,
        DateFormatPipe,
        AppComponent,
        ModalComponent,
        PromptComponent,
        SendActionDirective,
        SubstringPipe,
        LayoutSplitterDirective
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        TextFieldModule,
        OverlayModule,
        IconsModule
    ],
    providers: [LayoutService, AppService],
    bootstrap: [AppComponent],
})
export class AppModule {
}
