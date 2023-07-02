import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {useMind} from '../../libs/mind/mind';
import {treeData4} from '../../libs/mind/treeData';


@Component({
    selector: 'layout',
    templateUrl: 'layout.component.html',
    styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit {

    @ViewChild('mindContainerRef', {static: true}) mindContainerRef!: ElementRef<HTMLElement>;
    @ViewChild('gridContainerRef', {static: true}) gridContainerRef!: ElementRef<HTMLElement>;

    constructor() {
    }

    ngOnInit() {
        // useMind(treeData4, this.gridContainerRef.nativeElement, this.mindContainerRef.nativeElement);
    }
}
