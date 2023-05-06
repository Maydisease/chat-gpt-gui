import {Component, OnInit} from '@angular/core';
import {CLEAR_TYPE, SettingService} from "./setting.service";
import {ModalService} from "../../unit/modal/modal.service";
import {ConfigService} from "../../../config/config.service";

@Component({
    selector: 'setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.scss']
})

export class SettingComponent implements OnInit {

    public CLEAR_TYPE = CLEAR_TYPE;

    public timer: any;

    constructor(
        public configService: ConfigService,
        public settingService: SettingService,
        public modalService: ModalService
    ) {
    }

    ngOnInit() {
        // this.modalService.create('xxx111')
    }

    public close() {
        this.settingService.close();
    }

    async secretKeyChangeHandle(event: KeyboardEvent) {
        const element = event.target as HTMLTextAreaElement;
        element.value = element.value.trim();
        this.configService.CONFIG.BASE_SECRET_KEY = element.value;
        clearTimeout(this.timer);
        this.timer = setTimeout(async () => {
            await this.settingService.update();
        }, 500)
    }


}
