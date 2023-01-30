import { Component } from '@angular/core';
import { QRCodeService } from '../../../shared/services/qr-code/qr-code.service';
import { ShareService } from '../../../shared/services/share/share.service';
import { ClipboardService } from '../../../shared/services/clipboard/clipboard.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { ActivatedRoute } from '@angular/router';
import { PlatformService } from '../../../shared/services/platform/platform.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-receive',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__left ux_toolbar__rounded">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.receive.header' | translate }}</ion-title>
        <ion-label class="ux-font-text-xs ux_toolbar__step" slot="end"
          >2 {{ 'shared.step_counter.of' | translate }} 2</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="wr">
        <div class="wr__title">
          <ion-item lines="none" class="ion-no-margin ion-no-padding">
            <ion-text class="ux-font-text-lg">{{ 'wallets.receive.title' | translate }}</ion-text>
            <ion-button
              name="Share Wallet Address"
              id="share-address-button"
              appTrackClick
              fill="clear"
              class="ion-no-margin"
              (click)="this.shareAddress()"
              *ngIf="this.isNativePlatform"
            >
              <ion-icon name="ux-share" class="ux-fsize-18"></ion-icon>
            </ion-button>
          </ion-item>
        </div>
        <div class="wr__card-content">
     
          <app-asset-detail
            [blockchain]="this.selectedNetwork"
            [token]="this.currency?.value"
            [tokenLogo]="this.currency?.logoRoute"
          ></app-asset-detail>
          <div class="wr__card-content__qr-content" *ngIf="addressQr">
            <img id="qr-img" [src]="this.addressQr" />
          </div>
          <div class="wr__card-content__receive-address">
            <ion-label class="ux-font-titulo-xs">
              {{ 'wallets.receive.receive_address_title' | translate }}
            </ion-label>
            <ion-item class="ion-no-padding ion-no-margin" lines="none">
              <ion-label class="ux-font-text-base">{{ this.address }}</ion-label>
              <ion-button
                name="Copy Wallet Address"
                class="ux-font-button ion-no-margin"
                color="primary"
                appTrackClick
                id="copy-address-button"
                fill="clear"
                (click)="this.copyAddress()"
              >
                {{ 'wallets.receive.receive_address_copy' | translate }}
              </ion-button>
            </ion-item>
          </div>
          <div class="wr__card-content__disclaimer" *ngIf="this.currency">
          <app-backup-information-card
            [text]="
            'wallets.receive.disclaimer_header'
                  | translate: { currency: this.currency.value, network: this.selectedNetwork | formattedNetwork
                    }
            "
            [textClass]="'ux-home-backup-card'"
          >
          </app-backup-information-card>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./receive.page.scss'],
})
export class ReceivePage {
  currency: Coin;
  selectedNetwork: string;
  networks: string[];
  isNativePlatform: boolean;
  address: string;
  addressQr: string;

  constructor(
    private qrCodeService: QRCodeService,
    private clipboardService: ClipboardService,
    private shareService: ShareService,
    private toastService: ToastService,
    private translate: TranslateService,
    private walletEncryptionService: WalletEncryptionService,
    private route: ActivatedRoute,
    private platformService: PlatformService,
    private apiWalletService: ApiWalletService,
    private navController: NavController
  ) {}

  ionViewWillEnter() {
    this.checkPlatform();
    this.getSelectedCoinAndNetworks();
    this.getAddress();
  }

  private getSelectedCoinAndNetworks() {
    const coin = this.route.snapshot.queryParamMap.get('asset');
    const network = this.route.snapshot.queryParamMap.get('network');

    this.currency = this.apiWalletService.getCoin(coin, network);
    this.networks = this.apiWalletService.getNetworks(coin);
    this.selectedNetwork = network;
  }
  checkPlatform() {
    this.isNativePlatform = this.platformService.isNative();
  }

  getAddress() {
    this.walletEncryptionService.getEncryptedWallet().then((wallet) => {
      this.address = wallet.addresses[this.selectedNetwork];
      this.generateAddressQR();
    });
  }
  
  async copyAddress() {
    await this.clipboardService
      .write({
        string: this.address,
      })
      .then(() => {
        this.showToast('wallets.receive.toast_success');
      });
  }

  private showToast(text: string) {
    this.toastService.showInfoToast({
      message: this.translate.instant(text),
    });
  }

  shareAddress() {
    this.shareService.share(
      {
        title: this.translate.instant('wallets.receive.share_title'),
        dialogTitle: this.translate.instant('wallets.receive.share_title'),
        text: this.address,
      }
    ).catch(() => {
      this.copyAddress();
    });
  }

  generateAddressQR() {
    this.qrCodeService.generateQRFromText(this.address).then((qr) => (this.addressQr = qr));
  }
}
