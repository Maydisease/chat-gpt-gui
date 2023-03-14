import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {OverlayModule} from '@angular/cdk/overlay';

import {AppComponent} from "./app.component";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {TextFieldModule} from '@angular/cdk/text-field';
import {SendActionDirective} from "./sendAction.directive";
import {SubstringPipe} from "../pipes/substring.pipe";

@NgModule({
    declarations: [AppComponent, SendActionDirective, SubstringPipe],
    imports: [BrowserModule, FormsModule, HttpClientModule, TextFieldModule, OverlayModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
