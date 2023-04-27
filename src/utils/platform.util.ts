import {EventEmitter, Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class PlatformUtilService {

    public deviceChange = new EventEmitter();
    public darkModeChange = new EventEmitter();

    public isMobile = () => window.screen.width < 500;

    public isPC = false;

    public isTauri = Boolean(typeof window !== 'undefined' && window !== undefined && window.__TAURI_IPC__ !== undefined);

    public isDarkMode = false;

    constructor() {

        // 监听PC/Mobile的变化
        this.isPC = document.querySelector('body')!.clientWidth > 800;
        window.onresize = () => {
            const state = document.querySelector('body')!.clientWidth > 800;
            if (this.isPC !== state) {
                this.deviceChange.emit(this.isPC);
            }
            this.isPC = state;

        }

        // 监听暗黑模式切换的变化
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.isDarkMode = darkModeMediaQuery.matches;
        darkModeMediaQuery.addEventListener('change', (e) => {
            if (e.matches) {
                this.isDarkMode = true;
                this.darkModeChange.emit(true);
            } else {
                this.isDarkMode = false;
                this.darkModeChange.emit(false);
            }
        });
    }
}
