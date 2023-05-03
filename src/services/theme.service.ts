import {Injectable} from '@angular/core';
import {PlatformUtilService} from "../utils/platform.util";

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private readonly darkThemeClass = 'dark';

    constructor(
        public platformUtilService: PlatformUtilService
    ) {
        this.platformUtilService.darkModeChange.subscribe((isDarkMode) => {
            this.setTheme(isDarkMode ? 'Dark' : 'Light');
        });
        this.setTheme(this.platformUtilService.isDarkMode ? 'Dark' : 'Light');
    }

    setTheme(name: 'Dark' | 'Light') {

        const body = document.getElementsByTagName('body')[0];
        if (name === 'Dark') {
            body.classList.add(this.darkThemeClass);
            body.removeAttribute('data-theme');
        }

        if (name === 'Light') {
            body.classList.remove(this.darkThemeClass);
            body.setAttribute('data-theme', 'light');
        }

    }
}
