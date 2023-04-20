import {AfterViewInit, Component, OnInit,} from "@angular/core";
import {invoke} from "@tauri-apps/api/tauri";
import {appWindow} from "@tauri-apps/api/window";
import {handleIsTauri} from "../main";
import {ThemeService} from "../services/theme.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, AfterViewInit {

    async ngOnInit() {
        await appWindow.setTitle('x81881').then(() => {
            console.log('x81881:', 99999991)
        })
    }

    constructor(public themeService: ThemeService) {
    }

    // 在页面渲染完成后，将与tauri通信，告知已经渲染完毕
    public async ngAfterViewInit() {
        if (handleIsTauri()) {
            await invoke("init_process", {});
            // setTimeout(() => {
            //     this.themeService.toggleTheme();
            // },3000)
        }
    }
}
