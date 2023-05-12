import {Injectable} from '@angular/core';
import {invoke} from "@tauri-apps/api/tauri";
import {PlatformUtilService} from "../utils/platform.util";

@Injectable({providedIn: 'root'})
export class HttpCryptoService {

    constructor(
        public platformUtilService: PlatformUtilService,
    ) {
    }

    async encrypt(body: { [key: string]: any }) {

        let newBody: { [key: string]: any } = {};

        if (this.platformUtilService.isTauri) {
            console.time('invoke:http_encrypt')
            newBody = {
                encrypt: await invoke("http_encrypt", {body: JSON.stringify(body)})
            };
            console.timeEnd('invoke:http_encrypt')
        } else {
            newBody = body;
        }

        return JSON.stringify(newBody);
    }
}
