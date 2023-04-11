import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import promptConfig from './prompt.config.json';
import {md5} from "../../libs/md5";
import {scrollSmoothTo} from "../../utils/scrollToView.util";
import Mark from 'mark.js';
import {AppService} from "../../app/app.service";
import {PromptService} from "./prompt.service";
import {PlatformUtilService} from "../../utils/platform.util";
import {debounce, interval} from "rxjs";

type PromptList = { title: string, content: string, selected?: boolean, disabled?: boolean }[]

@Component({
    selector: 'app-prompt',
    templateUrl: './prompt.component.html',
    styleUrls: ['./prompt.component.scss']
})

export class PromptComponent implements OnInit {

    @Input('isPC') isPc = false;

    public findState = false;
    public lock = false;

    public markInstance: Mark | undefined;

    @ViewChild('promptListElementRef', {static: true}) promptListElementRef!: ElementRef<HTMLElement>;
    @ViewChild('wrapElementRef', {static: true}) wrapElementRef!: ElementRef<HTMLElement>;

    public promptList: PromptList = [];
    public promptListClone: PromptList = [];

    constructor(
        public promptService: PromptService,
        public appService: AppService,
        public platformUtilService: PlatformUtilService,
        public renderer: Renderer2,
        public cdr: ChangeDetectorRef
    ) {
        promptConfig.map((item) => {
            this.promptList.push({...item, selected: false, disabled: false});
        });
        this.promptListClone = this.promptList;
    }

    ngOnInit() {
        let debounceTime = 200;
        setTimeout(() => {
            this.setSearchMark();
        }, debounceTime)
        this.platformUtilService.deviceChange
            .pipe(debounce(() => interval(debounceTime)))
            .subscribe(() => {
                this.setSearchMark();
            });
    }

    public unSearchMark() {
        if (!this.markInstance) {
            return;
        }
        this.markInstance.unmark({
            element: 'span',
            className: 'search-keyword-highlight',
            exclude: ['.hljs-line-numbers'],
            separateWordSearch: false,
            done: (marksTotal: number) => {
                this.cdr.detectChanges();
            }
        });
    }

    setSearchMark() {
        console.log(88181)
        this.promptList = this.promptListClone.filter((item) => {

            let isFind = false;

            if (item.title.indexOf(this.promptService.searchKeyword) > -1) {
                isFind = true;
            } else if (item.content.indexOf(this.promptService.searchKeyword) > -1) {
                isFind = true;
            }

            return isFind;
        });

        this.markInstance = new Mark(this.wrapElementRef.nativeElement);
        this.unSearchMark();
        this.markInstance.mark(this.promptService.searchKeyword, {
            element: 'span',
            className: 'search-keyword-highlight',
            exclude: ['.hljs-line-numbers'],
            separateWordSearch: false,
            acrossElements: true,
            done: (count: number) => {
                this.cdr.detectChanges();
            },
            each: (item: HTMLElement) => {

            }
        })
    }

    searchPrompt() {
        this.cleanHiddenState();
        this.setSearchMark();
    }

    cleanSearchKeyword() {
        this.promptService.searchKeyword = '';
        this.promptList = this.promptListClone;
        this.unSearchMark();
    }

    promptScrollHandle() {
        if (this.lock) {
            return;
        }
        this.cleanHidden();
    }

    public cleanHidden() {
        const container = this.promptListElementRef.nativeElement;
        const elementList = container.querySelectorAll('.item')
        elementList.forEach((item) => {
            item.classList.remove('hidden');
        })
    }

    copyHandle(str: string) {

        // copyText(undefined, str);

        if (!this.isPc) {
            this.appService.isPromptMode = false;
        }

        this.appService.searchKey = str;
    }

    public cleanHiddenState() {
        const container = this.promptListElementRef.nativeElement;
        const elementList = container.querySelectorAll('.item')
        elementList.forEach((item) => {
            item.classList.remove('hidden');
        })
    }

    promptSelectHandle(event: Event) {

        this.cleanSearchKeyword();
        this.promptList = this.promptListClone;
        this.lock = true;
        const target = event.target as HTMLOptionElement;
        const container = this.promptListElementRef.nativeElement;

        const elementList = container.querySelectorAll('.item');
        elementList.forEach((item) => {
            this.renderer.addClass(item, 'hidden');
        })

        const targetElement = container.querySelector('#link_' + md5(target.value)) as HTMLElement;
        this.renderer.removeClass(targetElement, 'hidden');
        scrollSmoothTo(undefined, container, targetElement!, 100).then(() => {
            setTimeout(() => {
                this.lock = false;
            }, 200)
            this.findState = true;
        })
    }
}
