import { Component } from '@angular/core';
import { COINS } from '../constants/coins';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QRCodeService } from '../../../shared/services/qr-code/qr-code.service';
import { ShareService } from '../../../shared/services/share/share.service';
import { ClipboardService } from '../../../shared/services/clipboard/clipboard.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';

@Component({
  selector: 'app-receive',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.receive.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-start ion-padding-end wr">
      <div class="wr__title">
        <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22">{{
          'wallets.receive.title' | translate
        }}</ion-text>
      </div>
      <div class="wr__currency-select">
        <ion-text class="ux-font-lato ux-fweight-semibold ux-fsize-12">{{
          'wallets.receive.currency_select' | translate
        }}</ion-text>
        <form [formGroup]="this.form">
          <app-ux-input-select
            [modalTitle]="'wallets.receive.currency_select_modal_title' | translate"
            [placeholder]="'wallets.receive.currency_select_modal_title' | translate"
            controlName="currency"
            [data]="this.currencies"
            keyName="name"
            valueName="value"
          ></app-ux-input-select>
        </form>
      </div>
      <div class="wr__remaining-time-text">
        <ion-text color="uxsemidark" class="ux-font-lato ux-fweight-regular ux-fsize-12">{{
          'wallets.receive.average_time' | translate
        }}</ion-text>
      </div>
      <div class="wr__qr-content" *ngIf="addressQr">
        <img id="qr-img" [src]="this.addressQr" />
      </div>
      <div class="wr__receive-address">
        <ion-item lines="none">
          <ion-label class="ux-font-lato ux-fsize-16 ux-fweight-regular">{{ this.address }}</ion-label>
          <ion-button
            name="Copy Wallet Address"
            appTrackClick
            id="copy-address-button"
            fill="clear"
            (click)="this.copyAddress()"
          >
            <ion-icon name="copy-outline" style="margin-left: 8px;"></ion-icon
          ></ion-button>
        </ion-item>
      </div>
      <div class="wr__share-content">
        <ion-button
          name="Share Wallet Address"
          id="share-address-button"
          appTrackClick
          fill="clear"
          class="ux-font-lato ux-fsize-16 ux-fweight-regular"
          (click)="this.shareAddress()"
          >{{ 'wallets.receive.share' | translate }} <ion-icon name="ux-share" style="margin-left: 8px;"></ion-icon
        ></ion-button>
      </div>
      <div class="wr__disclaimer">
        <ion-text class="ux-font-lato ux-fweight-bold ux-fsize-12">
          {{ 'wallets.receive.disclaimer_header' | translate: { currency: this.selectedCurrency } }}
        </ion-text>
        <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-12">
          {{ 'wallets.receive.disclaimer_body' | translate: { currency: this.selectedCurrency } }}
        </ion-text>
      </div>
    </ion-content>
  `,
  styleUrls: ['./receive.page.scss'],
})
export class ReceivePage {
  form: FormGroup = this.formBuilder.group({
    currency: ['', Validators.required],
  });

  currencies: Coin[] = COINS.filter((coin) => coin.value === 'ETH');
  address: string;
  addressQr: string;
  selectedCurrency: string;
  constructor(
    private formBuilder: FormBuilder,
    private qrCodeService: QRCodeService,
    private clipboardService: ClipboardService,
    private shareService: ShareService,
    private toastService: ToastService,
    private translate: TranslateService,
    private walletEncryptionService: WalletEncryptionService
  ) {}

  ionViewWillEnter() {
    this.subscribeToFormChanges();
  }

  subscribeToFormChanges() {
    this.form.valueChanges.subscribe((value) => this.getAddress(value.currency));
    this.form.valueChanges.subscribe((value) => this.setCurrencyOnLabel(value.currency));
    this.form.patchValue({ currency: 'ETH' });
  }

  setCurrencyOnLabel(currency: string) {
    this.selectedCurrency = currency;
  }

  getAddress(currency: string) {
    this.walletEncryptionService.getEncryptedWallet().then((wallet) => {
      this.address = wallet.addresses[currency];
      this.generateAddressQR();
    });
  }

  async copyAddress() {
    await this.clipboardService
      .write({
        string: this.address,
      })
      .then(() => {
        this.showToast('shared.services.copy.toast_success');
      });
  }

  private showToast(text: string) {
    this.toastService.showToast({
      message: this.translate.instant(text),
    });
  }

  async shareAddress() {
    await this.shareService.share(
      {
        title: this.translate.instant('wallets.receive.share_title'),
        dialogTitle: this.translate.instant('wallets.receive.share_title'),
        text: this.address,
      },
      this.translate.instant('shared.services.share.share_error')
    );
  }

  generateAddressQR() {
    this.qrCodeService.generateQRFromText(this.address).then((qr) => (this.addressQr = qr));
  }
}
