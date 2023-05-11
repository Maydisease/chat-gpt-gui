import { AfterViewInit, Component, OnInit, } from "@angular/core";
import { invoke } from "@tauri-apps/api/tauri";
import { handleIsTauri } from "../main";
import { ThemeService } from "../services/theme.service";
import { AppService } from "./app.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, AfterViewInit {

  async ngOnInit() {

  }

  constructor(public themeService: ThemeService, public appService: AppService) {
  }

  // 在页面渲染完成后，将与tauri通信，告知已经渲染完毕
  public async ngAfterViewInit() {
    if (handleIsTauri()) {
      await invoke("init_process", {});
    }
  }
}
