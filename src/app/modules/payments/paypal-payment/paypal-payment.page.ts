import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Plugins } from '@capacitor/core';

const { Browser } = Plugins;

@Component({
  selector: 'app-paypal-payment',
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
      <div class="nr__title">
        <ion-text
          class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22"
        >
          {{ 'payment.title' | translate }}
        </ion-text>
      </div>
      <div class="submit-button">
        <div
          class="nr__submit-button ion-padding-start ion-padding-end ion-padding-top"
        >
          <ion-button
            class="ux_button"
            size="large"
            color="uxsecondary"
            (click)="openBrowser()"
          >
            {{ 'payment.paypal_button' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./paypal-payment.page.scss'],
})
export class PaypalPaymentPage implements OnInit {
  constructor(private translate: TranslateService) {}

  ngOnInit() {}

  openBrowser() {
    Browser.open({
      toolbarColor: 'red',
      url: 'https://py.pl/IZg5M4XLCm',
    });
  }
}
