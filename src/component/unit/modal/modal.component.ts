import {Component, Inject, OnInit, Optional} from '@angular/core';
import {ModalContextBase} from "./modal.service";

@Component({
  selector: 'modal-root',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit {

  constructor(
    @Optional() @Inject('context') public context: ModalContextBase
  ) {
  }

  public detach() {
    this.context.$m?.detach(this.context.$m?.key);
  }

  cancel() {
    this.context.$event.cancel && this.context.$event.cancel();
    this.detach();
  }

  confirm() {
    this.context.$event.confirm && this.context.$event.confirm();
    this.detach();
  }

  ngOnInit() {
  }
}
