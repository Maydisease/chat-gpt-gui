import {Pipe, PipeTransform, Renderer2} from '@angular/core';
import {MarkdownService} from "../services/markdown.service";
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import scss from 'highlight.js/lib/languages/scss';
import css from 'highlight.js/lib/languages/css';
import rust from 'highlight.js/lib/languages/rust';
import go from 'highlight.js/lib/languages/go';
import c from 'highlight.js/lib/languages/c';
import php from 'highlight.js/lib/languages/php';
import java from 'highlight.js/lib/languages/java';
import sql from 'highlight.js/lib/languages/sql';
import python from 'highlight.js/lib/languages/python';
import swift from 'highlight.js/lib/languages/swift';
import xml from 'highlight.js/lib/languages/xml';
import wasm from 'highlight.js/lib/languages/wasm';
import objectivec from 'highlight.js/lib/languages/objectivec';
import {invoke} from "@tauri-apps/api/tauri";

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('css', css);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('c', c);
hljs.registerLanguage('php', php);
hljs.registerLanguage('java', java);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('python', python);
hljs.registerLanguage('swift', swift);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('wasm', wasm);
hljs.registerLanguage('objectivec', objectivec);

@Pipe({
    name: 'md2html'
})

export class Md2HtmlPipe implements PipeTransform {

    constructor(public markdownService: MarkdownService, r2: Renderer2) {

    }

    public async transform(md: any, ...args: any[]): Promise<string> {

        let result = '';

        if (!md) {
            return result;
        }
        console.time('Z')
        try {
            // result = this.markdownService.toHtml(md);
            result = this.markdownService.toHtml(md);
            // console.time('X')
            // result = await invoke("md_2_html", {markdown: md});
            // console.timeEnd('X')
            const htmlDom = new DOMParser().parseFromString(result, 'text/html').body;
            htmlDom.querySelectorAll('pre').forEach((element) => {
                const codeElement = element.querySelector('code')!
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
                            <span class="copy code-render-copy">copy</span>
                            <code class="value">${codeElement.innerText}</code>
                        </div>
                        <pre class="container">${html}</pre>
                    </div>
                `;
            })
            result = htmlDom.innerHTML;
        } catch (err) {
        }


        console.timeEnd('Z')

        return result;

    }
}
