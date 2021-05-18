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
        <div class="main__primary_text">
          <ion-text>{{ 'fiat_ramps.fiat_success.textPrimary' | translate }}</ion-text>
        </div>

        <div class="main__secondary_text">
          <ion-text>{{ 'fiat_ramps.fiat_success.textSecondary' | translate }}</ion-text>
        </div>

        <ion-list class="main__bank_info">
          <!-- TODO: Controlar padding de todo esto -->
          <ion-item class="main__bank_info__content ion-no-padding">
            <ion-col class="" size="3">{{ 'fiat_ramps.fiat_success.amount' | translate }}</ion-col>
            <ion-col class="main__bank_info__content__left">
              <span>
                {{ this.operationData.amount_in | currency }} {{ this.operationData.currency_in | uppercase }}
              </span>
            </ion-col>
          </ion-item>
          <ion-item class="main__bank_info__content ion-no-padding">
            <ion-col class="" size="3">{{ 'fiat_ramps.fiat_success.bank' | translate }}</ion-col>
            <ion-col class="main__bank_info__content__left ion-no-padding"><span>HSBC</span></ion-col>
          </ion-item>
          <ion-item class="main__bank_info__content ion-no-padding">
            <ion-col class="" size="3">{{ 'fiat_ramps.fiat_success.cbu' | translate }}</ion-col>
            <ion-col class="main__bank_info__content__left ion-no-padding"><span>1500623500062332502528</span></ion-col>
          </ion-item>
          <ion-item class="main__bank_info__content ion-no-padding">
            <ion-col class="" size="3">{{ 'fiat_ramps.fiat_success.concept' | translate }}</ion-col>
            <ion-col class="main__bank_info__content__left ion-no-padding"
              ><span>No se sabe, nadie lo sabe</span></ion-col
            >
          </ion-item>
        </ion-list>

        <div class="main__telegram">
          <div class="main__telegram__secondary_text">
            <ion-text>{{ 'fiat_ramps.fiat_success.info_telegram' | translate }}</ion-text>
          </div>

          <div class="main__telegram__telegram_logo">
            <img
              src="../../assets/img/fiat-ramps/success-kripton/contact-us-telegram.svg"
              alt="Contact us Telegram image"
              (click)="this.launchChat()"
            />
          </div>
        </div>

        <div class="main__secondary_text">
          <app-ux-text>{{ 'fiat_ramps.fiat_success.info_email' | translate }}</app-ux-text>
        </div>

        <div class="main__actions">
          <div class="main__actions__primary">
            <ion-button class="ux_button" appTrackClick name="Add Voucher" (click)="this.backToOperations()">
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
  telegramApp = 'https://t.me/kriptonmarket';
  operationData: any;

  constructor(private storageOperationService: StorageOperationService, private navController: NavController) {
    Browser.prefetch({
      urls: [this.telegramApp],
    });
  }

  ngOnInit() {
    // this.storageOperationService.data.subscribe((data) => (this.operationData = data));
    this.operationData = {
      amount_in: 300.0,
      currency_in: 'ars',
    };
  }

  async launchChat() {
    await Browser.open({
      toolbarColor: '#ff9100',
      url: this.telegramApp,
    });
  }

  backToOperations() {
    this.navController.navigateBack(['fiat-ramps/operations']);
  }
}
