import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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
              <div class="pm__title ux-font-gilory ux-fweight-extrabold ux-fsize-24">
                <ion-text>{{'payment.title' | translate }}</ion-text>
              </div>
              <div class="ux_content">
                <div>
                  <ion-list>
                      <app-method
                          *ngFor="let method of paymentMethods"
                          [paymentMethods]="method"
                      >
                      </app-method>
                  </ion-list>
                </div> 
              </div>
          </div>
    </ion-content>
  `,
  styleUrls: ['./payment-methods.page.scss'],
})
export class PaymentMethodsPage implements OnInit{
  public paymentMethods = [
    {
      name: 'PayPal',
      link: 'https://py.pl/IZg5M4XLCm',
      img: "../../../../assets/img/payment-methods/paypal.png"
    },
    {
      name: 'MercadoPago',
      link: 'https://www.mercadopago.com/mla/debits/new?preapproval_plan_id=2c93808478f916c70179003e21d40717',
      img: '../../../../assets/img/payment-methods/mercadopago.png'
    },
    {
      name: 'BitPay',
      link: 'https://bitpay.com',
      img: '../../../../assets/img/payment-methods/bitpay.png',
      description:'(BTC/BUSD/RIPPLE)'
    },
    {
      name: 'Binance',
      link: '',
      img: '../../../../assets/img/payment-methods/binance.png',
      description:'(BTC/BUSD/RIPPLE)'
    }
  ]
  constructor(private translate: TranslateService) { }

  ngOnInit() { }

}
