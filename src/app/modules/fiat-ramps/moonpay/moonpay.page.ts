import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { FiatRampOperation } from '../shared-ramps/interfaces/fiat-ramp-operation.interface';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { ProviderTokensOf } from '../shared-ramps/models/provider-tokens-of/provider-tokens-of';
import { Providers } from '../shared-ramps/models/providers/providers.interface';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { WalletMaintenanceService } from '../../wallets/shared-wallets/services/wallet-maintenance/wallet-maintenance.service';

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
    <ion-content class="ion-padding-start ion-padding-end">
      <form [formGroup]="this.form">
        <app-provider-new-operation-card
          *ngIf="this.form.value.currency"
          [amountEnabled]="false"
          [coin]="this.form.value.currency"
          [provider]="this.provider"
          (changeCurrency)="this.changeCurrency()"
        ></app-provider-new-operation-card>
      </form>
      <ion-button
        appTrackClick
        name="ux_buy_moonpay_continue"
        expand="block"
        size="large"
        type="submit"
        class="ux_button"
        color="secondary"
        (click)="this.openMoonpay()"
      >
        {{ 'fiat_ramps.moonpay.button_text' | translate }}
      </ion-button>
    </ion-content>
  `,
  styleUrls: ['./moonpay.page.scss'],
})
export class MoonpayPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    currency: ['', Validators.required],
  });
  coins: Coin[];
  address: string;
  operationsList: FiatRampOperation[];
  provider: FiatRampProvider;
  countryIsoCodeAlpha3: string;

  constructor(
    private formBuilder: FormBuilder,
    private browserService: BrowserService,
    private route: ActivatedRoute,
    private fiatRampsService: FiatRampsService,
    private navController: NavController,
    private apiWalletService: ApiWalletService,
    private providers: ProvidersFactory,
    private walletMaintenance: WalletMaintenanceService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.provider = this.getProviders().byAlias('moonpay');
    this.countryIsoCodeAlpha3 = this.route.snapshot.queryParamMap.get('country');
    this.subscribeToFormChanges();
    this.initAssetsForm();
  }

  ionViewDidLeave() {
    this.walletMaintenance.wipeDataFromService();
  }

  async initAssetsForm() {
    await this.walletMaintenance.getEncryptedWalletFromStorage();

    this.coins = this.providerTokens();
    const token = this.route.snapshot.queryParamMap.get('asset');
    const network = this.route.snapshot.queryParamMap.get('network');
    if (token && network) {
      this.form.patchValue({ currency: this.coins.find((coin) => coin.value === token && coin.network === network) });
    } else {
      this.form.patchValue({ currency: this.coins[0] });
    }
  }

  providerTokens() {
    return new ProviderTokensOf(this.getProviders(), this.apiWalletService.getCoins()).byAlias(this.provider.alias);
  }

  getProviders(): Providers {
    return this.providers.create();
  }

  subscribeToFormChanges() {
    this.form.get('currency').valueChanges.subscribe((value) => {
      this.getAddress(value);
    });
  }

  getAddress(value: Coin) {
    this.address = this.walletMaintenance.encryptedWallet.addresses[value.network];
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

  changeCurrency(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        country: this.countryIsoCodeAlpha3,
      },
    };

    this.navController.navigateForward(['/fiat-ramps/token-selection', this.provider.alias], navigationExtras);
  }

  addBoughtCoinIfUserDoesNotHaveIt(): Promise<void> {
    return this.walletMaintenance.addCoinIfUserDoesNotHaveIt(this.form.value.currency);
  }
}
