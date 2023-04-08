import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import promptConfig from './prompt.config.json';
import {md5} from "../../libs/md5";
import {scrollSmoothTo} from "../../utils/scrollToView.util";
import {copyText} from "../../libs/copy.util";
import {AppService} from "../../app/app.service";

type PromptList = { title: string, content: string }[]

@Component({
    selector: 'app-prompt',
    templateUrl: './prompt.component.html',
    styleUrls: ['./prompt.component.scss']
})

export class PromptComponent implements OnInit {

    @Input('isPC') isPc = false;

    public findState = false;
    public lock = false;

    @ViewChild('promptListElementRef') promptListElementRef!: ElementRef<HTMLElement>

    public promptList: PromptList = promptConfig;

    constructor(
        public appService: AppService,
    ) {
    }

    ngOnInit() {
        console.log('init..')
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

    promptSelectHandle(event: Event) {

        console.log('6666161')

        this.lock = true;
        const target = event.target as HTMLOptionElement;
        const container = this.promptListElementRef.nativeElement;

        const elementList = container.querySelectorAll('.item')

        elementList.forEach((item) => {
            item.classList.add('hidden');
        })

        const targetElement = container.querySelector('#link_' + md5(target.value)) as HTMLElement;
        console.log('targetElement::', targetElement)
        targetElement.classList.remove('hidden');
        scrollSmoothTo(undefined, container, targetElement!, 100).then(() => {
            setTimeout(() => {
                this.lock = false;
            }, 200)
            this.findState = true;
        })
    }
}
