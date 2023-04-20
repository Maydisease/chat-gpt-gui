import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private readonly darkThemeClass = 'dark';

    constructor() {
    }

    toggleTheme(): void {
        const body = document.getElementsByTagName('body')[0];
        if (body.classList.contains(this.darkThemeClass)) {
            body.classList.remove(this.darkThemeClass);
            body.removeAttribute('data-theme');
        } else {
            body.classList.add(this.darkThemeClass);
            body.setAttribute('data-theme', 'dark');
        }
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
