import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {OverlayModule} from '@angular/cdk/overlay';

import {AppComponent} from "./app.component";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {TextFieldModule} from '@angular/cdk/text-field';
import {SendActionDirective} from "./sendAction.directive";
import {SubstringPipe} from "../pipes/substring.pipe";
import {IconsModule} from "../component/icons/icons.module";
import {ModalComponent} from "../component/modal/modal.component";

@NgModule({
  declarations: [AppComponent, ModalComponent, SendActionDirective, SubstringPipe],
  imports: [BrowserModule, FormsModule, HttpClientModule, TextFieldModule, OverlayModule, IconsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
