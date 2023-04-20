import {Injectable} from '@angular/core';
import {init, format} from '../libs/cmark';

@Injectable({providedIn: 'root'})
export class MarkdownService {

    public isLoad = false;
    public timer: any;

    constructor() {
        this.initWasm();
    }

    initWasm() {
        return new Promise((resolve, reject) => {
            if (this.isLoad) {
                resolve(true);
                return;
            }

            this.timer && clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                init().then(() => {
                    this.isLoad = true;
                    resolve(true);
                });
            }, 0)

        })
    }

    public toHtml(markdownString: string) {
        return format(markdownString);
    }
}

