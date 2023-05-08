import {Injectable} from '@angular/core';
import {trackEvent} from "@aptabase/tauri";
import {PlatformUtilService} from "../utils/platform.util";
import {ConfigService} from "../config/config.service";

@Injectable({providedIn: 'root'})
export class TrackEventService {

    constructor(
        public platformUtilService: PlatformUtilService,
        public configService: ConfigService,
    ) {
    }

    send(eventName: string, payload: { [key: string]: any } = {}) {
        const userId = this.configService.CONFIG.USER_ID;
        return new Promise((resolve, reject) => {
            if (this.platformUtilService.isTauri) {
                payload['uid'] = userId;
                if (this.configService.CONFIG.IS_PRODUCTION) {
                    resolve(trackEvent(`${eventName}`, payload))
                } else {
                    resolve(true)
                }

            } else {
                resolve(true)
            }
        })
    }
}
