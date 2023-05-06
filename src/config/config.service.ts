import {Injectable} from '@angular/core';
import {SettingConfigItem} from "../component/advanced/setting/setting.model";

@Injectable({providedIn: 'root'})
export class ConfigService {

    public CONFIG: SettingConfigItem = {
        BASE_SECRET_KEY: '',
        CONTEXT_ENABLE: 1,
        CONTEXT_ENABLE_AUTO_CUT: 1
    };

    constructor() {
    }
}
