import {Injectable} from '@angular/core';
import hljs from "highlight.js";
import {MarkdownService} from "./markdown.service";

@Injectable({providedIn: 'root'})
export class HighlightService {

    constructor(
        public markdownService: MarkdownService
    ) {
    }

    public to(value: string) {
        let result = '';

        if (!value) {
            return result;
        }

        try {
            result = this.markdownService.toHtml(value);
            const htmlDom = new DOMParser().parseFromString(result, 'text/html').body;
            htmlDom.querySelectorAll('pre').forEach((element) => {
                const codeElement = element.querySelector('code')!;
                const languageString = codeElement.getAttribute('class');
                let languageName = '';
                let html = hljs.highlightAuto(codeElement.innerText).value;
                if (languageString && languageString.indexOf('language-') > -1) {
                    const startIndex = languageString.indexOf('language-') + 'language-'.length;
                    const endIndex = languageString.length;
                    languageName = languageString.substring(startIndex, endIndex);
                    try {
                        html = hljs.highlight(codeElement.innerText, {language: languageName}).value;
                    } catch (err) {
                    }
                }
                element.outerHTML = `
                    <div class="code-render">
                        <div class="tools">
                            <span class="copy">copy</span>
                        </div>
                        <pre class="container">${html}</pre>
                    </div>
                `;
            })
            result = htmlDom.innerHTML;
        } catch (err) {
        }

        return result;
    }
}
