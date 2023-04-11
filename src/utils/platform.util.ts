import {EventEmitter, Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class PlatformUtilService {

    public deviceChange = new EventEmitter();

    public isMobile = () => window.screen.width < 500;

    public isPC = false;

    public isTauri = Boolean(typeof window !== 'undefined' && window !== undefined && window.__TAURI_IPC__ !== undefined);

    constructor() {
        this.isPC = document.querySelector('body')!.clientWidth > 800;
        window.onresize = () => {
            const state = document.querySelector('body')!.clientWidth > 800;
            if (this.isPC !== state) {
                console.log(1003)
                this.deviceChange.emit(this.isPC);
            }
            this.isPC = state;

        }
    }
}
