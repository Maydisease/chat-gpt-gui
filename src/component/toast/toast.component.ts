import { Component, Inject, OnInit } from '@angular/core';
import { ContextBase } from './toast.service'

export interface ToastContext {
  message: string;
  timeout: number;
}

type _Context = ToastContext & Required<ContextBase>;

@Component({
  styleUrls: ['./toast.component.scss'],
  templateUrl: './toast.component.html'
})
export class ToastComponent implements OnInit {

  constructor(
    @Inject('context') public context: _Context
  ) {}

  public ngOnInit() {
    setTimeout(() => {
      this.closeHandle();
    }, this.context.timeout);
  }

  closeHandle() {
    const { detach, key } = this.context.$m;
    detach(key);
  }
}
