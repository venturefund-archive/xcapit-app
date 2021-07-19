import { Component, OnInit } from '@angular/core';
import { ApiPaymentsService } from 'src/app/modules/payments/shared-payments/services/api-payments.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-methods',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/payment/select-license"></ion-back-button>
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
  public paymentMethodsAssets = [
    {
      name: 'PayPal',
      link: 'https://py.pl/IZg5M4XLCm',
      img: '../../../../assets/img/payment-methods/paypal.png',
    },
    {
      name: 'Mercadopago',
      link: 'https://www.mercadopago.com/mla/debits/new?preapproval_plan_id=2c93808478f916c70179003e21d40717',
      img: '../../../../assets/img/payment-methods/mercadopago.png',
    },
    {
      name: 'BitPay',
      link: '',
      img: '../../../../assets/img/payment-methods/bitpay.png',
    },
    {
      name: 'Binance',
      link: '',
      img: '../../../../assets/img/payment-methods/binance.png',
    },
  ];
  planID: string;
  paymentMethods = [];
  constructor(private apiPayment: ApiPaymentsService, private route: ActivatedRoute) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.planID = this.route.snapshot.paramMap.get('plan_id');
    this.apiPayment.getPaymentMethods(this.planID).subscribe((res) => {
      res.forEach((element) => {
        const methodAssets = this.paymentMethodsAssets.filter((method) => method.name === element.name);
        this.paymentMethods.push({ ...element, ...methodAssets[0] });
      });
    });
  }
}
