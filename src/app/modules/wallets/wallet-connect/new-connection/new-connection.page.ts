import { Component } from '@angular/core';
import { WalletConnectService, IPeerMeta } from '../../shared-wallets/services/wallet-connect/wallet-connect.service';
import { StorageService } from '../../shared-wallets/services/storage-wallets/storage-wallets.service';
import { environment } from 'src/environments/environment';
import { IProviderData, supportedProviders } from '../../shared-wallets/constants/supported-providers';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { PlatformService } from '../../../../shared/services/platform/platform.service';
import { NavController } from '@ionic/angular';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { ScanQrModalComponent } from '../../../../shared/components/scan-qr-modal/scan-qr-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { WCWallet } from '../../shared-wallets/models/wallet-connect/wc-wallet.type';
import { WalletsFactory } from '../../../swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { BlockchainsFactory } from '../../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { WCService } from '../../shared-wallets/services/wallet-connect/wc-service/wc.service';
import { WCConnectionV2 } from '../../shared-wallets/services/wallet-connect/wc-connection-v2/wc-connection-v2';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

@Component({
  selector: 'app-new-connection',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home" (click)="this.cleanForm()"></ion-back-button>
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
                    <ion-item
                      class="ux-font-input-label"
                      appTrackClick
                      [dataToTrack]="{ eventLabel: wallet.dataToTrack }"
                    >
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
              name="ux_wc_next"
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
export class NewConnectionPage {
  public peerMeta: IPeerMeta;
  public connected = false;
  public selectedWallet: WCWallet;
  public address: string;
  public activeChainId = 1;
  public dappInfo: boolean;
  public walletsList: WCWallet[] = [];
  public isNative: boolean;
  public providers: IProviderData[] = [];

  form: UntypedFormGroup = this.formBuilder.group({
    wallet: [null, [Validators.required]],
    uri: ['', [Validators.required]],
  });

  constructor(
    private walletConnectService: WalletConnectService,
    private storageService: StorageService,
    private formBuilder: UntypedFormBuilder,
    private platformService: PlatformService,
    private navController: NavController,
    private modalController: ModalController,
    private alertController: AlertController,
    private translate: TranslateService,
    private toastService: ToastService,
    private platform: Platform,
    private wcService: WCService,
    private wcConnectionV2: WCConnectionV2,
    private wallets: WalletsFactory,
    private blockchains: BlockchainsFactory,
    private remoteConfig: RemoteConfigService
  ) {}

  async ionViewWillEnter() {
    this.platform.backButton.subscribe(() => this.cleanForm());
    await this.checkConnectionStatus();
  }

  async checkConnectionStatus() {
    if (this.wcService.connected()) {
      this.navController.navigateRoot(['wallets/wallet-connect/connection-detail']);
    } else {
      await this.initializePage();
    }
  }

  private async initializePage() {
    this.providers = supportedProviders;
    await this.setWalletsInfo();
    this.isNative = this.platformService.isNative();
    await this.uriSubscription();
  }

  private async uriSubscription() {
    this.form.patchValue({ uri: this.wcService.uri()?.value() });
  }

  private async getSupportedWallets() {
    const walletsAddrs = await this.storageService.getWalletsAddresses();
    const wallets = Object.entries(walletsAddrs).filter(([key, value]) => {
      const supported = this.providers.filter((prov) => prov.chain === key)[0];

      if (supported) return walletsAddrs[key];
    });

    return Object.fromEntries(wallets);
  }

  private async setWalletsInfo() {
    const walletsAddrs = await this.getSupportedWallets();
    this.walletsList = Object.keys(walletsAddrs).map((addrKey) => {
      const provider = this.providers.filter(
        (prov) => prov.network === environment.walletNetwork && prov.chain === addrKey
      )[0];

      return {
        address: walletsAddrs[addrKey],
        network: addrKey,
        chainId: provider.chain_id,
        name: provider.name,
        logo: provider.logo,
        symbol: provider.native_currency.symbol,
        rpc: provider.rpc_url,
        dataToTrack: `ux_wc_${this.dataToTrack(addrKey)}`,
      };
    });
  }

  dataToTrack(symbol: string) {
    const translations = { RSK: 'rsk', BSC_BEP20: 'bsc', ERC20: 'eth', MATIC: 'pol' };
    return translations[symbol];
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

  cleanForm() {
    this.walletConnectService.setUri('');
    this.form.patchValue({ wallet: null, uri: '' });
  }

  isValidQR(content: string): boolean {
    return content.includes('wc:') && (content.includes('bridge=') || content.includes('relay-protocol='));
  }

  async showErrorToast(errorCode: string) {
    await this.toastService.showErrorToast({
      message: this.translate.instant(errorCode),
    });
  }

  setWalletInfo(wallet) {
    this.selectedWallet = wallet;
  }

  protected async initWallet(): Promise<void> {
    this.form.valid ? await this.initWalletConnect() : this.form.markAllAsTouched();
  }

  private async initWalletConnect() {
    this.wcService.initialize(this.form.value.uri);
    if (this.wcService.uri().isV2() && this.remoteConfig.getFeatureFlag('ff_walletConnectV2')) {
      this.initWalletConnectV2();
    } else if (!this.wcService.uri().isV2()) {
      this.legacyInit();
    } else {
      await this.showErrorToast('wallets.wallet_connect.errors.invalidUri');
    }
  }

  public async initWalletConnectV2() {
    try {
      const blockchain = this.blockchains.create().oneById(this.selectedWallet.chainId.toString());
      const wallet = await this.wallets.create().oneBy(blockchain);
      await this.wcConnectionV2.pairTo(this.wcService.uri(), wallet);
      this.navController.navigateForward(['/wallets/wallet-connect/connection-detail']);
      this.form.patchValue({ wallet: null, uri: '' });
    } catch (error) {
      await this.showAlertOnConnectionError();
    } 
  }

  public async legacyInit(): Promise<void> {
    try {
      await this.walletConnectService.setAccountInfo(this.selectedWallet);
      await this.walletConnectService.initWalletConnect(this.form.value.uri);
      const response = await this.walletConnectService.checkDappStatus();

      if (response) {
        this.navController.navigateForward(['/wallets/wallet-connect/connection-detail']);
        this.form.patchValue({ wallet: null, uri: '' });
      }
    } catch (error) {
      await this.killSession();
      await this.showAlertOnConnectionError();
    }
  }

  public async showAlertOnConnectionError() {
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
  }

  public async killSession() {
    await this.walletConnectService.killSession();
  }

  supportHelp() {
    this.navController.navigateForward('/tickets/create-support-ticket');
  }
}
