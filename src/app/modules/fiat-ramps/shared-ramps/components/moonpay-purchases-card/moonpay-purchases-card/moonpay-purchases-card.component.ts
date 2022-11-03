import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LINKS } from 'src/app/config/static-links';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';

@Component({
  selector: 'app-moonpay-purchases-card',
  template: ` <ion-card class="ux-card ion-no-margin">
    <ion-card-header [ngClass]="this.cssWithLine">
      <ion-card-title class="card-title ux-font-text-lg"
        >{{ 'fiat_ramps.moonpay_purchases.title' | translate }}
        <ion-icon name="information-circle" color="info"></ion-icon>
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <div class="message">
        <ion-text class="first-text ux-font-text-base ion-no-padding">
          {{ 'fiat_ramps.moonpay_purchases.message' | translate }}
        </ion-text>
        <ion-text class="link ux-link-xl" (click)="this.browseTo()">
          {{ 'fiat_ramps.moonpay_purchases.link' | translate }}
        </ion-text>
      </div>
    </ion-card-content>
  </ion-card>`,
  styleUrls: ['./moonpay-purchases-card.component.scss'],
})
export class MoonpayPurchasesCardComponent implements OnInit {
  cssWithLine: string;

  constructor(private browserService: BrowserService) {}

  ngOnInit() {}

  async browseTo() {
    await this.browserService.open({ url: LINKS.moonpayTransactionHistory });
  }
}
