import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-payment-methods',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'payment.methods.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="ux_main">
        <div class="pm__title ux-font-gilory ux-fweight-extrabold ux-fsize-24">
          <ion-text>{{ 'payment.methods.title' | translate }}</ion-text>
        </div>
        <div class="ux_content">
          <div>
            <ion-list>
              <app-method *ngFor="let method of paymentMethods" [paymentMethods]="method"> </app-method>
            </ion-list>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./payment-methods.page.scss'],
})
export class PaymentMethodsPage implements OnInit {
  public paymentMethods = [
    {
      name: 'PayPal',
      link: 'https://py.pl/IZg5M4XLCm',
      img: '../../../../assets/img/payment-methods/paypal.png',
      description: 'payment.methods.all_countries',
    },
    {
      name: 'MercadoPago',
      link: 'https://www.mercadopago.com/mla/debits/new?preapproval_plan_id=2c93808478f916c70179003e21d40717',
      img: '../../../../assets/img/payment-methods/mercadopago.png',
      description: 'payment.methods.arg',
    },
    {
      name: 'BitPay',
      link: '',
      img: '../../../../assets/img/payment-methods/bitpay.png',
      description: 'payment.methods.all_countries',
    },
    {
      name: 'Binance',
      link: '',
      img: '../../../../assets/img/payment-methods/binance.png',
      description: 'payment.methods.all_countries',
    },
  ];
  constructor() {}

  ngOnInit() {}
}
