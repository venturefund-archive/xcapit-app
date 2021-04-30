import { Component, OnInit } from '@angular/core';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { NavController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

const { Browser } = Plugins;

@Component({
  selector: 'app-success-page',
  template: `
    <ion-content class="ion-padding">
      <div class="main">
        <div class="main__ux_success_image">
          <app-ux-success-img></app-ux-success-img>
        </div>

        <div class="main__primary_text">
          <app-ux-title>{{ 'fiat_ramps.fiat_success.textPrimary' | translate }}</app-ux-title>
        </div>

        <div class="main__secondary_text">
          <app-ux-text>{{ 'fiat_ramps.fiat_success.textSecondary' | translate }}</app-ux-text>
        </div>

        <div class="main__bank_info">
          <div class="main__bank_info__content">
            {{ 'fiat_ramps.fiat_success.bank' | translate }}
            <span>HSBC</span>
          </div>
          <div class="main__bank_info__content">
            {{ 'fiat_ramps.fiat_success.cbu' | translate }}
            <span>1500623500062332502528</span>
          </div>
          <div class="main__bank_info__content">
            {{ 'fiat_ramps.fiat_success.concept' | translate }}
            <span>Ver concepto a colocar</span>
          </div>
          <div class="main__bank_info__content">
            {{ 'fiat_ramps.fiat_success.amount' | translate }}
            <span>$ {{ this.operationData.amount_in }} {{ this.operationData.currency_in }}</span>
          </div>
        </div>

        <div class="main__secondary_text">
          <app-ux-text>{{ 'fiat_ramps.fiat_success.info_telegram' | translate }}</app-ux-text>
        </div>

        <div class="main__telegram_logo">
          <img src="../../assets/img/telegram_logo.png" alt="Telegram logo" (click)="this.launchChat()" />
        </div>

        <div class="main__secondary_text">
          <app-ux-text>{{ 'fiat_ramps.fiat_success.info_email' | translate }}</app-ux-text>
        </div>

        <div class="main__actions">
          <div class="main__actions__primary">
            <ion-button
              class="ux_button"
              appTrackClick="!this.unauth"
              appTrackClickUnauth="this.unauth"
              name="Success Action Primary"
              (click)="this.backToOperations()"
            >
              {{ 'fiat_ramps.fiat_success.buttonText' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./success-page.page.scss'],
})
export class SuccessPagePage implements OnInit {
  telegram_app = 'https://t.me/kriptonmarket';
  operationData: any;

  constructor(private storageOperationService: StorageOperationService, private navController: NavController) {
    Browser.prefetch({
      urls: [this.telegram_app],
    });
  }

  ngOnInit() {
    this.storageOperationService.data.subscribe((data) => (this.operationData = data));
  }

  async launchChat() {
    await Browser.open({
      toolbarColor: '#ff9100',
      url: this.telegram_app,
    });
  }

  backToOperations() {
    this.navController.navigateRoot(['fiat-ramps/operations']);
  }
}
