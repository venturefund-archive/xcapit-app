import { Component, OnInit } from '@angular/core';
import { WalletConnectService } from '../../shared-wallets/services/wallet-connect/wallet-connect.service';
import { StorageService } from '../../shared-wallets/services/storage-wallets/storage-wallets.service';
import { environment } from 'src/environments/environment';
import { supportedProviders } from '../../shared-wallets/constants/supported-providers';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlatformService } from '../../../../shared/services/platform/platform.service';
import { NavController } from '@ionic/angular';
import { AlertController, ModalController } from '@ionic/angular';
import { ScanQrModalComponent } from '../../../../shared/components/scan-qr-modal/scan-qr-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { ToastService } from '../../../../shared/services/toast/toast.service';

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
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">
          {{ 'wallets.wallet_connect.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="ux_content" id="connectionForm">
        <app-informative-card
          [title]="'wallets.wallet_connect.card_title'"
          [description]="'wallets.wallet_connect.card_description'"
        ></app-informative-card>
        <div *ngIf="walletsList?.length > 0" class="ux-card">
          <form [formGroup]="this.form" (ngSubmit)="this.initWallet()">
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
                    class="qr-code"
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
              class="ion-padding-start ion-padding-end ux_button"
              appTrackClick
              name="Next"
              type="submit"
              color="secondary"
              size="large"
              expand="block"
            >
              {{ 'wallets.wallet_connect.button_continue' | translate }}
            </ion-button>

            <div class="wcnc__disclaimer ion-padding">
              <span>{{ 'wallets.wallet_connect.disclaimer_1' | translate }}</span>
              <span>
                {{ 'wallets.wallet_connect.disclaimer_2' | translate }}

                <ion-button
                  name="Support Help"
                  class="ux-link-xs wcnc__disclaimer__button"
                  (click)="this.supportHelp()"
                  appTrackClick
                  fill="clear"
                >
                  {{ 'wallets.wallet_connect.disclaimer_support' | translate }}
                </ion-button>
              </span>
            </div>
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
  public walletsList: any[] = [];
  public isNative: boolean;
  public providers: any[] = [];

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
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {}

  ionViewWillEnter() {
    this.isConnected();
  }

  ngOnInit() {}

  isConnected() {
    if (this.walletConnectService.connected) {
      this.navController.navigateRoot(['wallets/wallet-connect/connection-detail']);
    } else {
      this.providers = supportedProviders;
      this.setWalletsInfo();
      this.isNative = this.platformService.isNative();
      this.form.controls.uri.setValue(this.walletConnectService.uri);
    }
  }

  public async setWalletsInfo() {
    const walletsAddrs = await this.storageService.getWalletsAddresses();
    this.walletsList = Object.keys(walletsAddrs).map((AddrKey) => {
      const provider = this.providers.filter(
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
    const modal = await this.modalController.create({
      component: ScanQrModalComponent,
      componentProps: {
        title: this.translate.instant('wallets.wallet_connect.scan_qr.header'),
        cancelText: '',
      },
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    await this.handleScanResult(data, role);
  }

  async handleScanResult(data, role) {
    if (role !== 'unauthorized' && !this.isValidQR(data)) role = 'error';

    switch (role) {
      case 'success':
        this.form.patchValue({ uri: data });
        break;
      case 'error':
        await this.showErrorToast(this.translate.instant('wallets.wallet_connect.scan_qr.errors.invalidQR'));
        break;
      case 'unauthorized':
        await this.showErrorToast(this.translate.instant('wallets.wallet_connect.scan_qr.errors.permissionDenied'));
        break;
    }
  }

  isValidQR(content: string): boolean {
    return content.includes('wc:') && content.includes('bridge=');
  }

  async showErrorToast(errorCode: string) {
    await this.toastService
      .showErrorToast({
        message: this.translate.instant(errorCode),
      });
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

  supportHelp() {
    this.navController.navigateForward('/tickets/create-support-ticket');
  }
}
