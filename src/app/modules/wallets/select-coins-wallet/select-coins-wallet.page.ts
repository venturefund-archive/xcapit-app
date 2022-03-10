import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { ActivatedRoute } from '@angular/router';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { Coin } from '../shared-wallets/interfaces/coin.interface';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { TranslateService } from '@ngx-translate/core';
import { WalletMaintenanceService } from '../shared-wallets/services/wallet-maintenance/wallet-maintenance.service';
import { WalletPasswordComponent } from '../shared-wallets/components/wallet-password/wallet-password.component';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
@Component({
  selector: 'app-select-coins-wallet',
  template: ` <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ this.headerText | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding sc">
      <form
        [formGroup]="this.form"
        (ngSubmit)="this.handleSubmit()"
        class="ux_main"
        *ngIf="!!this.form && this.userCoinsLoaded"
      >
        <div class="sc__content ux_content">
          <app-ux-title class="ion-padding-top ion-margin-top ">
            <div class="sc__title ux-font-text-lg ion-margin-top">
              {{ 'wallets.select_coin.title' | translate }}
            </div>
          </app-ux-title>
          <app-ux-text class="ion-padding-top ion-margin-top">
            <div class="sc__subtitle ux-font-text-base">
              {{ 'wallets.select_coin.subtitle' | translate }}
            </div>
          </app-ux-text>
          <ion-item lines="none" class="sc__toggle_all ux-font-title-xs ion-no-padding">
            <ion-label class="sc__toggle_all__label ion-no-margin ion-no-padding">
              {{ 'wallets.select_coin.toggle_all_text' | translate }}
            </ion-label>
            <ion-toggle
              name="Toggle All Coins"
              class="sc__toggle_all__toggle ux-toggle ion-no-padding"
              [checked]="this.allSelected"
              (click)="this.toggleAll($event)"
              mode="ios"
              slot="end"
            ></ion-toggle>
          </ion-item>
          <app-items-coin-group
            [network]="network"
            [coins]="this.getCoinsFromNetwork(network)"
            (changed)="this.setAllSelected()"
            *ngFor="let network of this.networks"
          ></app-items-coin-group>
        </div>
        <div class="ux_footer">
          <div class="sc__next_button">
            <ion-button
              [disabled]="!this.almostOneChecked || this.txInProgress"
              color="uxsecondary"
              class="ux_button"
              appTrackClick
              name="ux_create_next"
              type="submit"
              size="large"
              [appLoading]="this.loading"
              [loadingText]="'wallets.select_coin.loading' | translate"
            >
              {{ this.submitButtonText | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>`,
  styleUrls: ['./select-coins-wallet.page.scss'],
})
export class SelectCoinsWalletPage implements OnInit {
  headerText: string;
  submitButtonText: string;
  mode: string;
  userCoinsLoaded: boolean;
  txInProgress: boolean;
  form: FormGroup;
  allSelected = false;
  loading = false;

  get networks(): string[] {
    return this.apiWalletService.getNetworks();
  }

  almostOneChecked = false;
  originalFormData: any;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private navController: NavController,
    private walletService: WalletService,
    private apiWalletService: ApiWalletService,
    private loadingService: LoadingService,
    private translate: TranslateService,
    private modalController: ModalController,
    private walletMaintenanceService: WalletMaintenanceService,
    private toastService: ToastService
  ) {}

  ionViewWillEnter() {
    this.txInProgress = false;
    this.userCoinsLoaded = false;
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.updateTexts();
    this.createForm();

    if (this.mode === 'edit') {
      this.getUserCoins();
    }
  }

  ngOnInit() {}

  createForm() {
    if (!this.form) {
      const formGroup = {};

      this.networks.forEach((network) => {
        formGroup[network] = this.createSuiteFormGroup(this.getCoinsFromNetwork(network));
      });

      this.form = this.formBuilder.group(formGroup);

      this.form.valueChanges.subscribe(() => this.setContinueButtonState());
    }
  }

  getCoinsFromNetwork(network: string) {
    return this.apiWalletService.getCoinsFromNetwork(network);
  }

  createSuiteFormGroup(suite: Coin[]): FormGroup {
    const formGroup = {};
    suite.forEach((c) => {
      formGroup[c.value] = [false];
    });

    return this.formBuilder.group(formGroup);
  }

  almostOneToggledInSuite(suite) {
    return Object.values(this.form.value[suite]).some(Boolean);
  }

  setContinueButtonState() {
    this.almostOneChecked = this.almostOneToggled();
  }

  almostOneToggled() {
    const suites = Object.keys(this.form.value);
    return suites.map((suite) => this.almostOneToggledInSuite(suite)).some(Boolean);
  }

  async handleSubmit() {
    if (this.almostOneChecked) {
      this.txInProgress = true;
      switch (this.mode) {
        case 'import':
          this.importWallet();
          break;
        case 'edit':
          this.editTokens();
          break;
        default:
          this.createWallet();
          break;
      }
      this.txInProgress = false;
    }
  }

  importWallet() {
    this.loading = true;
    this.walletService.coins = [];
    this.setUserCoins();
    this.walletService
      .create()
      .then(() => this.navController.navigateForward(['/wallets/create-password', 'import']))
      .finally(() => (this.loading = false));
  }

  async editTokens() {
    const changedAssets = this.getChangedAssets();

    if (this.walletMaintenanceService.isUpdated()) {
      await this.loadingService.show();
      await this.walletMaintenanceService.toggleAssets(changedAssets);
    } else {
      this.walletMaintenanceService.password = await this.askForPassword();

      if (!this.walletMaintenanceService.password) {
        this.txInProgress = false;
        return;
      }

      await this.loadingService.show();
      try {
        await this.walletMaintenanceService.updateWalletNetworks(changedAssets);
      } catch (error) {
        if (error.message.startsWith('invalid password')) {
          await this.loadingService.dismiss();
          this.showInvalidPasswordToast();
          return;
        }
      }
    }

    await this.walletMaintenanceService.saveWalletToStorage();
    await this.loadingService.dismiss();
    this.navController.navigateForward(['/tabs/wallets']);
  }

  async showInvalidPasswordToast() {
    await this.toastService.showErrorToast({
      message: this.translate.instant('wallets.send.error_incorrect_password.textPrimary'),
    });
    this.txInProgress = true;
    await this.editTokens();
  }

  createWallet() {
    this.walletService.coins = [];
    this.setUserCoins();
    this.navController.navigateForward(['/wallets/create-first/recovery-phrase']);
  }

  async askForPassword(): Promise<string> {
    const modal = await this.modalController.create({
      component: WalletPasswordComponent,
      cssClass: 'ux-routeroutlet-modal full-screen-modal',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    return data;
  }

  getSuiteFormGroupKeys(): string[] {
    return Object.keys(this.form.value);
  }

  getCoinFormGroupKeys(network: string): string[] {
    return Object.keys(this.form.value[network]);
  }

  setUserCoins() {
    this.getSuiteFormGroupKeys().forEach((network) => {
      this.getCoinFormGroupKeys(network).forEach((coinKey) => {
        if (this.form.value[network][coinKey]) {
          const coin = this.apiWalletService.getCoin(coinKey, network);
          if (coin) this.walletService.coins.push(coin);
        }
      });
    });
  }

  getUserCoins() {
    this.initializeFormData();

    this.walletMaintenanceService.getUserAssets().then((coins) => {
      coins.forEach((coin) => {
        this.originalFormData[coin.network][coin.value] = true;
      });

      this.form.patchValue(this.originalFormData);
      this.userCoinsLoaded = true;
      this.setAllSelected();
    });
  }

  private initializeFormData() {
    this.originalFormData = Object.assign({}, this.form.value);
  }

  private getChangedAssets(): string[] {
    const changedAssets = [];

    this.apiWalletService.getCoins().forEach((coin) => {
      if (this.form.value[coin.network][coin.value] !== this.originalFormData[coin.network][coin.value]) {
        changedAssets.push(coin.value);
      }
    });

    return changedAssets;
  }

  private updateTexts() {
    switch (this.mode) {
      case 'edit':
        this.headerText = 'wallets.select_coin.header_edit';
        this.submitButtonText = 'wallets.select_coin.submit_edit';
        return;
      case 'import':
        this.userCoinsLoaded = true;
        this.headerText = 'wallets.recovery_wallet.header';
        this.submitButtonText = 'deposit_addresses.deposit_currency.next_button';
        return;
      default:
        this.userCoinsLoaded = true;
        this.headerText = 'wallets.select_coin.header';
        this.submitButtonText = 'deposit_addresses.deposit_currency.next_button';
        return;
    }
  }

  toggleAll(event) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
    const setAll = !this.allSelected;

    this.getSuiteFormGroupKeys().forEach((network) => {
      this.getCoinFormGroupKeys(network).forEach((coin) => {
        this.form.get(network).get(coin).setValue(setAll);
      });
    });

    this.setAllSelected();
  }

  setAllSelected() {
    const networkToggledStates = [];

    this.getSuiteFormGroupKeys().forEach((network) => {
      networkToggledStates.push(Object.values(this.form.value[network]).every(Boolean));
    });

    this.allSelected = Object.values(networkToggledStates).every(Boolean);
  }
}
