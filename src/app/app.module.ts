import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {LayoutService} from "./layout/layout.service";
import {AppService} from "./app.service";
import {AppRoutingModule} from "./app-routing.module";
import {CommonModule} from "@angular/common";
import {ContextService} from "../component/advanced/context/context.service";

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
    constructor(
        public contextService: ContextService
    ) {

    }
}
