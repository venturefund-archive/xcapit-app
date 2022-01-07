import { Component, OnInit } from '@angular/core';
import { WalletConnectService } from '../../shared-wallets/services/wallet-connect/wallet-connect.service';
import { StorageService } from '../../shared-wallets/services/storage-wallets/storage-wallets.service';
import { environment } from 'src/environments/environment';
import { supportedProviders } from '../../shared-wallets/constants/supported-providers';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlatformService } from '../../../../shared/services/platform/platform.service';
import { NavController } from '@ionic/angular';
import { AlertController, ModalController } from '@ionic/angular';
import { WalletConnectQrScanComponent } from '../../shared-wallets/components/wallet-connect-qr-scan/wallet-connect-qr-scan.component';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../../../../shared/services/loading/loading.service';

export interface PeerMeta {
  description: string;
  url: string;
  icons: string[];
  name: string;
  ssl?: boolean;
}

@Component({
  selector: 'app-new-connection',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">
          {{ 'wallets.wallet_connect.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="ux_content">
        <div *ngIf="walletsList?.length > 0">
          <form [formGroup]="this.form" (ngSubmit)="this.initWallet()" id="connectionForm">
            <div class="wcnc">
              <app-ux-title class="ion-padding-top ion-margin-top">
                <div class="wcnc__title ion-margin-top">
                  {{ 'wallets.wallet_connect.title' | translate }}
                </div>
              </app-ux-title>

              <app-ux-text class="ion-padding-top ion-margin-top">
                <div class="wcnc__text_before ion-margin-top">
                  {{ 'wallets.wallet_connect.text_before' | translate }}
                </div>
              </app-ux-text>

              <div class="wcnc__radio_group">
                <ion-radio-group formControlName="wallet">
                  <div *ngFor="let wallet of walletsList" class="container">
                    <ion-item class="ux-font-input-label">
                      <ion-label>{{ wallet.name }}</ion-label>
                      <ion-radio
                        mode="md"
                        slot="start"
                        [value]="wallet.chain_id"
                        (click)="this.setWalletInfo(wallet)"
                      ></ion-radio>
                    </ion-item>
                  </div>
                </ion-radio-group>
                <app-errors-form-item controlName="wallet"></app-errors-form-item>
              </div>

              <div class="wcnc__qr_input ux_main">
                <ion-label>{{ 'wallets.wallet_connect.QR_label' | translate }}</ion-label>
                <ion-item>
                  <ion-input
                    placeholder="{{ 'wallets.wallet_connect.QR_placeholder' | translate }}"
                    formControlName="uri"
                    type="text"
                    [disabled]="!this.form.value.wallet"
                  ></ion-input>
                  <ion-icon
                    name="qr-code-outline"
                    slot="end"
                    (click)="this.openQRScanner()"
                    *ngIf="this.isNative"
                  ></ion-icon>
                </ion-item>
                <app-errors-form-item [controlName]="'uri'"></app-errors-form-item>
              </div>
            </div>

            <ion-button
              class="ux_button next_button"
              appTrackClick
              name="Next"
              type="submit"
              color="uxsecondary"
              size="large"
            >
              {{ 'wallets.wallet_connect.button_continue' | translate }}
            </ion-button>
          </form>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./new-connection.page.scss'],
})
export class NewConnectionPage implements OnInit {
  public peerMeta: PeerMeta;
  public connected = false;
  public selectedWallet = {};
  public address: string;
  public activeChainId = 1;
  public dappInfo: boolean;
  private walletsList: any[] = [];
  private isNative: boolean;

  form: FormGroup = this.formBuilder.group({
    wallet: [null, [Validators.required]],
    uri: ['', [Validators.required]],
  });

  constructor(
    private walletConnectService: WalletConnectService,
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private platformService: PlatformService,
    private navController: NavController,
    private modalController: ModalController,
    private alertController: AlertController,
    private translate: TranslateService,
    private loadingService: LoadingService
  ) {}

  ionViewWillEnter() {
    this.isConnected();
  }

  ngOnInit() {}

  isConnected() {
    if (this.walletConnectService.connected) {
      this.navController.navigateRoot(['wallets/wallet-connect/connection-detail']);
    } else {
      this.setWalletsInfo();
      this.isNative = this.platformService.isNative();
      this.form.controls.uri.setValue(this.walletConnectService.uri);
    }
  }

  public async setWalletsInfo() {
    const walletsAddrs = await this.storageService.getWalletsAddresses();

    this.walletsList = Object.keys(walletsAddrs).map((AddrKey) => {
      const provider = supportedProviders.filter(
        (prov) => prov.network === environment.walletNetwork && prov.chain === AddrKey
      )[0];
      return {
        address: walletsAddrs[AddrKey],
        network: AddrKey,
        chainId: provider.chain_id,
        name: provider.name,
        logo: provider.logo,
        symbol: provider.native_currency.symbol,
        rpc: provider.rpc_url,
      };
    });
  }

  public async openQRScanner() {
    this.hideBackground();

    const modal = await this.modalController.create({
      component: WalletConnectQrScanComponent,
      cssClass: '',
      swipeToClose: false,
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (!!data && data.error === false) {
      this.form.controls.uri.setValue(data.scannedQR);
    } else {
      this.form.controls.uri.setValue('');
    }

    this.showBackground();
  }

  hideBackground() {
    document.getElementsByTagName('html').item(0).classList.add('hidden');
    document.getElementById('connectionForm').classList.add('hidden');
  }

  showBackground() {
    document.getElementsByTagName('html').item(0).classList.remove('hid∫en');
    document.getElementById('connectionForm').classList.remove('hidden');
  }

  setWalletInfo(wallet) {
    this.selectedWallet = wallet;
  }

  public async initWallet(): Promise<void> {
    if (this.form.valid) {
      await this.initWalletConnect();
    } else {
      this.form.markAllAsTouched();
    }
  }

  public async initWalletConnect(): Promise<void> {
    await this.loadingService.show();

    try {
      await this.walletConnectService.setAccountInfo(this.selectedWallet);
      await this.walletConnectService.initWalletConnect(this.form.value.uri);
      const response = await this.walletConnectService.checkDappStatus();

      if (response) {
        this.navController.navigateForward(['/wallets/wallet-connect/connection-detail']);
      }
    } catch (error) {
      await this.killSession();
      const alert = await this.alertController.create({
        header: this.translate.instant('wallets.wallet_connect.init_wallet.errors.header'),
        message: this.translate.instant('wallets.wallet_connect.init_wallet.errors.message'),
        cssClass: 'ux-alert-small-text',
        buttons: [
          {
            text: this.translate.instant('wallets.wallet_connect.init_wallet.errors.close_button'),
            role: 'cancel',
            cssClass: 'ux-link-xs',
          },
        ],
      });
      await alert.present();
    } finally {
      await this.loadingService.dismiss();
    }
  }

  public async approveSession(): Promise<void> {
    await this.walletConnectService.approveSession();
    this.connected = true;
  }

  public async disconnectSession(): Promise<void> {
    await this.walletConnectService.killSession();
    this.connected = false;
  }

  public async killSession() {
    await this.walletConnectService.killSession();
  }
}
