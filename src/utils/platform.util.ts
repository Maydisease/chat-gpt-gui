import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class PlatformUtilService {

  public isMobile = () => window.screen.width < 500;

  public isPC = false;

  constructor() {
    console.log('platform:isMobile:', this.isMobile);
    this.isPC = document.querySelector('body')!.clientWidth > 800;
    window.onresize = () => {
      this.isPC = document.querySelector('body')!.clientWidth > 800;
    }
  }
}
