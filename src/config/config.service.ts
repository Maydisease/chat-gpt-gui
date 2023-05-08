import {Injectable} from '@angular/core';
import {environment} from "../environments/environment";
import {SettingConfigItem} from "../component/advanced/setting/setting.model";

@Injectable({providedIn: 'root'})
export class ConfigService {

    public CONFIG: SettingConfigItem = {
        BASE_SECRET_KEY: '',
        CONTEXT_ENABLE: 1,
        CONTEXT_ENABLE_AUTO_CUT: 1,
        USER_ID: '',
        IS_PRODUCTION: environment.production ? 1 : 0
    };

    constructor() {
    }
}
