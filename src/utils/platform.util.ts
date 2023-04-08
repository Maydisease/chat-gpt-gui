import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class PlatformUtilService {

  public isMobile = () => window.screen.width < 500;

  public isPC = false;

  public isTauri = Boolean(typeof window !== 'undefined' && window !== undefined && window.__TAURI_IPC__ !== undefined);

  constructor() {
    this.isPC = document.querySelector('body')!.clientWidth > 800;
    window.onresize = () => {
      this.isPC = document.querySelector('body')!.clientWidth > 800;
    }
  }
}
