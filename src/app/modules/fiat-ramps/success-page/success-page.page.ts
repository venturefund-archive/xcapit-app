import { Component, OnInit } from '@angular/core';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { NavController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { ClipboardService } from 'src/app/shared/services/clipboard/clipboard.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';

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
          <ion-item class="main__bank_info__content ion-no-padding">
            <ion-col class="main__bank_info__content__left" size="3">{{
              'fiat_ramps.fiat_success.amount' | translate
            }}</ion-col>
            <ion-col class="main__bank_info__content__right ion-no-padding">
              <span class="success-text">
                {{ this.operationData.amount_in | currency }} {{ this.operationData.currency_in | uppercase }}
              </span>
            </ion-col>
          </ion-item>
          <ion-item class="main__bank_info__content ion-no-padding">
            <ion-col class="main__bank_info__content__left" size="3">{{
              'fiat_ramps.fiat_success.bank' | translate
            }}</ion-col>
            <ion-col class="main__bank_info__content__right ion-no-padding"><span>HSBC</span></ion-col>
          </ion-item>
          <ion-item class="main__bank_info__content ion-no-padding">
            <ion-col class="main__bank_info__content__left" size="3">{{
              'fiat_ramps.fiat_success.cbu' | translate
            }}</ion-col>
            <ion-col class="main__bank_info__content__right ion-no-padding">
              <span>{{ this.cbu }}</span>
            </ion-col>
            <ion-col class="main__bank_info__content__right ion-no-padding" size="1">
              <ion-button
                appTrackClick
                name="Copy CBU to Clipboard"
                class="copy-button ion-no-margin"
                fill="clear"
                size="small"
                color="medium"
                (click)="this.copyToClipboard()"
              >
                <ion-icon name="copy"></ion-icon>
              </ion-button>
            </ion-col>
          </ion-item>
          <ion-item class="main__bank_info__content ion-no-padding">
            <ion-col class="main__bank_info__content__left" size="4">{{
              'fiat_ramps.fiat_success.concept' | translate
            }}</ion-col>
            <ion-col class="main__bank_info__content__right ion-no-padding">
              <span>Kriptobroker</span>
            </ion-col>
          </ion-item>
        </ion-list>

        <ion-item class="main__telegram" lines="none" (click)="this.launchChat()">
          <div class="main__telegram__secondary_text">
            <ion-text>{{ 'fiat_ramps.fiat_success.info_telegram' | translate }}</ion-text>
          </div>

          <div class="main__telegram__telegram_logo">
            <img
              class="main__telegram__telegram_logo__img"
              src="../../assets/img/fiat-ramps/success-kripton/contact-us-telegram.svg"
              alt="Contact us Telegram image"
            />
          </div>
        </ion-item>

        <div class="main__small_text">
          <ion-text>{{ 'fiat_ramps.fiat_success.info_email' | translate }}</ion-text>
        </div>

        <div class="main__actions">
          <div class="main__actions__primary">
            <ion-button class="ux_button" appTrackClick name="Add Voucher" (click)="this.addVoucher()">
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
  operationId: any;
  cbu = '1500623500062332502528';

  constructor(
    private storageOperationService: StorageOperationService,
    private navController: NavController,
    private clipboardService: ClipboardService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {
    Browser.prefetch({
      urls: [this.telegramApp],
    });
  }

  ngOnInit() {
    this.storageOperationService.data.subscribe((data) => (this.operationData = data));
    this.operationId = this.storageOperationService.getOperationId();
  }

  async launchChat() {
    await Browser.open({
      toolbarColor: '#ff9100',
      url: this.telegramApp,
    });
  }

  addVoucher() {
    this.navController.navigateForward(['fiat-ramps/operation-detail/provider/1/operation', this.operationId]);
  }

  copyToClipboard() {
    this.clipboardService.write({ url: this.cbu }).then(
      () => {
        this.showToast('fiat_ramps.fiat_success.copy_cbu_ok_text');
      },
      () => {
        this.showToast('fiat_ramps.fiat_success.copy_cbu_error_text');
      }
    );
  }

  private showToast(text: string) {
    this.toastService.showToast({
      message: this.translate.instant(text),
    });
  }
}
