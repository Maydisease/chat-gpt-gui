import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class PlatformUtilService {

  public isMobile = window.screen.width < 500;

  constructor() {
    console.log('platform:isMobile:', this.isMobile)
  }
}
