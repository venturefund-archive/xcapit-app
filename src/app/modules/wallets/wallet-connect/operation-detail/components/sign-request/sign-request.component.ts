import { Component, Input, OnInit } from '@angular/core';

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

      <div class="src__sign_request__message_container" id="message">
        {{ this.message }}
      </div>
    </div>
  `,
  styleUrls: ['./sign-request.component.scss'],
})
export class SignRequestComponent implements OnInit {
  @Input() message: any;
  @Input() dateInfo: any;

  constructor() { }

  ngOnInit() {}

}
