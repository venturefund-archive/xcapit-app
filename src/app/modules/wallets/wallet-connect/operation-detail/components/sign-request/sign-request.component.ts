import { Component, Inject, Input, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-sign-request',
  template: `
    <div class="src__container">
      <div class="src__container__title">
        <ion-label>
          {{ 'wallets.wallet_connect.operation_detail.date' | translate }}
        </ion-label>
      </div>

      <div class="src__container__content src__container__date">
        <span>{{ this.dateInfo.date }}</span>
        <span>{{ this.dateInfo.time }} H</span>
      </div>
    </div>

    <div class="src__sign_request">
      <ion-label>
        {{ 'wallets.wallet_connect.operation_detail.sign_message' | translate }}
      </ion-label>

      <div class="src__sign_request__message_container" id="message"></div>
    </div>
  `,
  styleUrls: ['./sign-request.component.scss'],
})
export class SignRequestComponent implements OnInit {
  @Input() message: HTMLElement;
  @Input() dateInfo: any;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    this.document.getElementById('message').appendChild(this.message);
  }
}
