import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { FiatRampOperation } from '../shared-ramps/interfaces/fiat-ramp-operation.interface';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { ProviderTokensOf } from '../shared-ramps/models/provider-tokens-of/provider-tokens-of';
import { Providers } from '../shared-ramps/models/providers/providers.interface';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { WalletMaintenanceService } from '../../wallets/shared-wallets/services/wallet-maintenance/wallet-maintenance.service';
import { TokenOperationDataService } from '../shared-ramps/services/token-operation-data/token-operation-data.service';

@Component({
  selector: 'app-moonpay',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'fiat_ramps.moonpay.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form [formGroup]="this.form">
        <app-provider-new-operation-card
          *ngIf="this.form.value.currency"
          [amountEnabled]="false"
          [coin]="this.form.value.currency"
          [provider]="this.provider"
          [coinSelectorEnabled]="false"
        ></app-provider-new-operation-card>
      </form>
    </ion-content>
    <ion-footer class="ion-padding ux_footer">
      <div class="ux_footer__content">
        <ion-text class="ux-font-text-xs">{{ 'fiat_ramps.moonpay.footer_description' | translate }} </ion-text>
      </div>
      <ion-button
        appTrackClick
        name="ux_buy_moonpay_continue"
        expand="block"
        size="large"
        class="ux_button"
        color="secondary"
        (click)="this.openMoonpay()"
      >
        {{ 'fiat_ramps.moonpay.button_text' | translate }}
      </ion-button>
    </ion-footer>
  `,
  styleUrls: ['./moonpay.page.scss'],
})
export class MoonpayPage implements OnInit {
  form: UntypedFormGroup = this.formBuilder.group({
    currency: ['', Validators.required],
  });
  coins: Coin[];
  address: string;
  operationsList: FiatRampOperation[];
  provider: FiatRampProvider;
  countryIsoCodeAlpha3: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private browserService: BrowserService,
    private fiatRampsService: FiatRampsService,
    private navController: NavController,
    private apiWalletService: ApiWalletService,
    private providers: ProvidersFactory,
    private walletMaintenance: WalletMaintenanceService,
    private tokenOperationDataService: TokenOperationDataService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.provider = this.getProviders().byAlias('moonpay');
    this.countryIsoCodeAlpha3 = this.tokenOperationDataService.tokenOperationData.country;
    this.initAssetsForm();
  }

  ionViewDidLeave() {
    this.walletMaintenance.wipeDataFromService();
  }

  async initAssetsForm() {
    await this.walletMaintenance.getEncryptedWalletFromStorage();
    this.coins = this.providerTokens();
    const { asset, network } = this.tokenOperationDataService.tokenOperationData;
    this.form.patchValue({ currency: this.coins.find((coin) => coin.value === asset && coin.network === network) });
  }

  providerTokens() {
    return new ProviderTokensOf(this.getProviders(), this.apiWalletService.getCoins()).byAlias(this.provider.alias);
  }

  getProviders(): Providers {
    return this.providers.create();
  }

  async openMoonpay() {
    this.fiatRampsService
      .getMoonpayLink(this.address, this.form.value.currency.moonpayCode)
      .toPromise()
      .then(async (link) => {
        this.success().then(() => {
          this.browserService.open(link);
        });
      });
  }

  async success(): Promise<boolean> {
    await this.addBoughtCoinIfUserDoesNotHaveIt();
    return this.navController.navigateForward(['/tabs/wallets']);
  }

  addBoughtCoinIfUserDoesNotHaveIt(): Promise<void> {
    return this.walletMaintenance.addCoinIfUserDoesNotHaveIt(this.form.value.currency);
  }
}
