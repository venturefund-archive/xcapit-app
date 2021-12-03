import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QRCodeService } from '../../../shared/services/qr-code/qr-code.service';
import { ShareService } from '../../../shared/services/share/share.service';
import { ClipboardService } from '../../../shared/services/clipboard/clipboard.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { ActivatedRoute } from '@angular/router';
import { PlatformService } from '../../../shared/services/platform/platform.service';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
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
        <ion-text class="ux-font-text-lg">{{ 'wallets.receive.title' | translate }}</ion-text>
      </div>
      <div class="wr__currency-select">
        <ion-text class="ux-font-lato ux-fweight-semibold ux-fsize-12">{{
          'wallets.receive.currency_select' | translate
        }}</ion-text>
        <form [formGroup]="this.form">
          <app-input-select
            [modalTitle]="'wallets.receive.currency_select_modal_title' | translate"
            [placeholder]="'wallets.receive.currency_select_modal_title' | translate"
            controlName="currency"
            [data]="this.currencies"
            key="name"
            valueKey="value"
            imageKey="logoRoute"
            selectorStyle="white"
          ></app-input-select>
        </form>
      </div>
      <div class="wr__network-select-card" *ngIf="this.networks">
        <app-network-select-card
          (networkChanged)="this.selectedNetworkChanged($event)"
          [title]="'wallets.send.send_detail.network_select.title' | translate"
          [networks]="this.networks"
          selectorStyle="receive"
          [selectedNetwork]="this.selectedNetwork"
        ></app-network-select-card>
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
      <div class="wr__share-content" *ngIf="this.isNativePlatform">
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
          {{ 'wallets.receive.disclaimer_header' | translate: { currency: this.form.value.currency.value } }}
        </ion-text>
        <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-12">
          {{ 'wallets.receive.disclaimer_body' | translate: { currency: this.form.value.currency.value } }}
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
  selectedNetwork: string;
  networks: string[];
  isNativePlatform: boolean;
  currencies: Coin[];
  address: string;
  addressQr: string;
  coins: Coin[];
  constructor(
    private formBuilder: FormBuilder,
    private qrCodeService: QRCodeService,
    private clipboardService: ClipboardService,
    private shareService: ShareService,
    private toastService: ToastService,
    private translate: TranslateService,
    private walletEncryptionService: WalletEncryptionService,
    private route: ActivatedRoute,
    private platformService: PlatformService,
    private storageService: StorageService,
    private apiWalletService: ApiWalletService
  ) {}

  ionViewWillEnter() {
    this.coins = this.apiWalletService.getCoins();
    this.checkPlatform();
    this.subscribeToFormChanges();
    this.getCorrectUserAssets();
  }

  checkPlatform() {
    this.isNativePlatform = this.platformService.isNative();
  }

  subscribeToFormChanges() {
    this.form.get('currency').valueChanges.subscribe((value) => {
      this.setCurrencyNetworks(value);
      this.getAddress(value);
    });
  }

  getAddress(currency: Coin) {
    this.walletEncryptionService.getEncryptedWallet().then((wallet) => {
      const network = this.coins.find((coin) => coin.value === currency.value).network;
      this.address = wallet.addresses[network];
      this.generateAddressQR();
    });
  }

  private setCurrencyNetworks(value) {
    this.networks = [value.network];
    this.selectedNetworkChanged(this.networks[0]);
  }

  selectedNetworkChanged(network) {
    this.selectedNetwork = network;
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
    this.toastService.showInfoToast({
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

  getCorrectUserAssets() {
    this.storageService.getAssestsSelected().then((coins) => {
      this.currencies = coins;
      this.route.queryParams.subscribe((params) => {
        if (params.asset) {
          this.form.patchValue({ currency: this.currencies.find((coin) => coin.value === params.asset) });
        } else {
          this.form.patchValue({ currency: this.currencies[0] });
        }
      });
    });
  }
}
