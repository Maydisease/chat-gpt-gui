import {NgModule, ChangeDetectorRef} from "@angular/core";
import {AppComponent} from "./app.component";
import {HttpClient} from "@angular/common/http";
import {LayoutService} from "./layout/layout.service";
import {AppService} from "./app.service";
import {ThemeService} from "../services/theme.service";
import {AppRoutingModule} from "./app-routing.module";
import {CommonModule} from "@angular/common";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        AppRoutingModule,
    ],
    providers: [LayoutService, AppService],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor() {
    }
}
