import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {LayoutService} from "./layout/layout.service";
import {AppService} from "./app.service";
import {ThemeService} from "../services/theme.service";
import {AppRoutingModule} from "./app-routing.module";

@NgModule({
    declarations: [],
    imports: [
        AppRoutingModule
    ],
    providers: [LayoutService, AppService],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(public themeService: ThemeService, public http: HttpClient) {
        this.themeService.toggleTheme();
        // this.loadWasm();

    }

    public async loadWasm() {

    }
}
