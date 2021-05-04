import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-methods',
  template: `
  <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'payment.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
  `,
  styleUrls: ['./payment-methods.page.scss'],
})
export class PaymentMethodsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
