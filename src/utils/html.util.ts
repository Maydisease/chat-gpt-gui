import {Injectable} from "@angular/core";
declare var Prism: any;

@Injectable({providedIn: 'root'})
export class HtmlUtilService {
    public removeHtmlTag(sourceStr: string): string {
       
        const REGX_HTML_DECODE = /&\w+;|&#(\d+);/g;
        // 去除HTML tag
        sourceStr = sourceStr.replace(/<\/?[^>]*>/g, '');
        // // 去除行尾空白
        // sourceStr = sourceStr.replace(/[ | ]*\n/g, '\n');
        // // 去除多余空行
        // sourceStr = sourceStr.replace(/\n[\s| | ]*\r/g, '\n');
        // // 去掉&nbsp;
        sourceStr = sourceStr.replace(/&(nbsp|amp);/ig, '');
        sourceStr = sourceStr.replace(/\n/g, '\n');
        // 去除&gt;
        sourceStr = sourceStr.replace(/\n/g, '\n');
         // 去除&lt;
        sourceStr = sourceStr.replace(/\n/g, '\n');

        return sourceStr.replace(REGX_HTML_DECODE,
            function($0,$1){
                const HTML_DECODE:any = {
                        "&lt;"  : "<", 
                        "&gt;"  : ">", 
                        "&amp;" : "&", 
                        "&nbsp;": " ", 
                        "&quot;": "\"", 
                        "&copy;": "©"
                        // Add more
                };
                var c = HTML_DECODE[$0]; // 尝试查表
                if(c === undefined){
                    // Maybe is Entity Number
                    if(!isNaN($1)){
                        c = String.fromCharCode(($1 == 160) ? 32 : $1);
                    }else{
                        // Not Entity Number
                        c = $0;
                    }
                }
                return c;
            });
    }

    public renderHighlight(htmlString: string) {
        const htmlElement = new DOMParser().parseFromString(htmlString, 'text/html');
        htmlElement.querySelectorAll('pre code').forEach((item) => {
            const preElement = item.closest('pre') as HTMLElement;
            const langString = item.getAttribute('class');
            let languageName = '';
            let highlightHtml = '';
            if (preElement) {
                highlightHtml = preElement.innerHTML;
                if (langString && langString.indexOf('language-') > -1) {
                    const startIndex = langString.indexOf('language-') + 'language-'.length;
                    const endIndex = langString.length;
                    languageName = langString.substring(startIndex, endIndex) || "javascript";
                    try {
                        highlightHtml = Prism.highlight(item.textContent, Prism.languages[languageName], languageName);
                    } catch (err) {
                    }
                }
                preElement.outerHTML = `
                                        <div class="code-render-container">
                                            <pre><code lang="${languageName}">${highlightHtml}</code></pre>
                                            <div class="code-render-copy">复制</div>
                                        </div>
                                       `;
            }
        });

        return htmlElement.querySelector('body')!.innerHTML;
    }

}
