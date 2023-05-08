import {Injectable} from "@angular/core";
import {Resolve, Router} from "@angular/router";
import {Observable} from "rxjs";
import {MarkdownService} from "../services/markdown.service";

@Injectable({providedIn: 'root'})
export class InitTaskResolveService implements Resolve<any> {

    constructor(
        public router: Router,
        public MarkdownService: MarkdownService
    ) {
    }

    resolve(): Observable<any> {
        return new Observable((ob) => {
            this.MarkdownService.initWasm().then(() => {
                ob.next(true);
                ob.complete();
            })
        })
    }
}
