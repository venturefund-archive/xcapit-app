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
        <ion-title class="ion-text-center">{{
          'payment.header' | translate
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <app-ux-title class="ion-padding-top ion-margin-top">
        <div class="ux-title">
          <div class="ion-margin-top">
            {{ 'payment.title' | translate }}
          </div>
        </div>
      </app-ux-title>
      <div class="ik__submit_button">
        <ion-button
          class="ux_button"
          appTrackClick
          color="uxsecondary"
          size="large"
          (click)="openBrowser()"
        >
          {{ 'payment.paypal_button' | translate }}
        </ion-button>
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
