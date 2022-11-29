import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LINKS } from 'src/app/config/static-links';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { ProvidersFactory } from '../../../models/providers/factory/providers.factory';
import { InfoProviderMoonpayComponent } from '../../info-provider-moonpay/info-provider-moonpay.component';

@Component({
  selector: 'app-moonpay-purchases-card',
  template: ` <ion-card class="ux-card ion-no-margin">
    <ion-card-header [ngClass]="this.cssWithLine">
      <ion-card-title class="card-title ux-font-text-lg"
        >{{ 'fiat_ramps.moonpay_purchases.title' | translate }}
        <ion-icon name="information-circle" color="info" (click)="this.showProviderInfo()"></ion-icon>
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
  isInfoModalOpen = false;
  constructor(
    private browserService: BrowserService,
    private modalController: ModalController,
    private providersFactory: ProvidersFactory
  ) {}

  ngOnInit() {}

  async browseTo() {
    await this.browserService.open({ url: LINKS.moonpayTransactionHistory });
  }

  provider() {
    return this.providersFactory.create().byAlias('moonpay');
  }

  async showProviderInfo() {
    if (!this.isInfoModalOpen) {
      this.isInfoModalOpen = true;
      await this.createMoonpayInfoModal();
      this.isInfoModalOpen = false;
    }
  }

  async createMoonpayInfoModal() {
    const modal = await this.modalController.create({
      component: InfoProviderMoonpayComponent,
      cssClass: 'ux-lg-modal-informative-provider-moonpay',
      backdropDismiss: false,
    });
    await modal.present();
  }
}
