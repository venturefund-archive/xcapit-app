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

    <ion-content>
  <div class="ux_main">
    <div class="ux_content">
      <div class="pm__title ux-font-gilory ux-fweight-extrabold ux-fsize-24">
            <ion-text>{{
                'payment.title' | translate
              }}</ion-text>
            </div>
      <div>
        <ion-list>
          <app-method
          *ngFor="let method of paymentMethods"
          [name]="this.method.name"
          [img]="this.method.img"
          >
          </app-method>
        </ion-list>
      </div>
    </div>
  </div> 
<ion-content>
  `,
  styleUrls: ['./payment-methods.page.scss'],
})
export class PaymentMethodsPage implements OnInit {
  public paymentMethods = [
    {
      name: 'PayPal',
      link: '',
      img: "../../../../assets/img/payment-methods/paypal.png"
    },
    {
      name: 'MercadoPago',
      link: '',
      img: '../../../../assets/img/payment-methods/mercadopago.png'
    },
    {
      name: 'BitPay',
      link: '',
      img: '../../../../assets/img/payment-methods/bitpay.png'
    },
    {
      name: 'Binance',
      link: '',
      img: '../../../../assets/img/payment-methods/binance.png'
    }
  ]
  constructor() { }

  ngOnInit() {
  }

}
