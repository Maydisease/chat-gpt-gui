import {Injectable} from '@angular/core';
import device from "current-device";

@Injectable({providedIn: 'root'})
export class PlatformUtilService {

  public isMobile = device.mobile();

  constructor() {
    console.log('platform:isMobile:', this.isMobile)
  }
}
