import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
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
import { CoinSelectorModalComponent } from '../shared-ramps/components/coin-selector-modal/coin-selector-modal.component';
import { WalletsFactory } from '../../swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { COUNTRIES } from '../shared-ramps/constants/countries';
import { FiatRampProviderCountry } from '../shared-ramps/interfaces/fiat-ramp-provider-country';
import RoundedNumber from 'src/app/shared/models/rounded-number/rounded-number';
import { DefaultMoonpayPrice } from '../shared-ramps/models/moonpay-price/default-moonpay-price';
import { DynamicMoonpayPrice } from '../shared-ramps/models/moonpay-price/dynamic-moonpay-price';
import { DynamicMoonpayPriceFactory } from '../shared-ramps/models/moonpay-price/factory/dynamic-moonpay-price-factory';
import { Subject } from 'rxjs';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';

@Component({
  selector: 'app-moonpay',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__rounded">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'fiat_ramps.moonpay.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <form [formGroup]="this.form">
        <app-provider-new-operation-card
          *ngIf="this.selectedCurrency"
          [coin]="this.selectedCurrency"
          [fiatCurrency]="this.fiatCurrency"
          [provider]="this.provider"
          [coinSelectorEnabled]="true"
          [minimumFiatAmount]="this.minimumFiatAmount"
          (changeCurrency)="this.openModal($event)"
          paymentType="fiat_ramps.shared.constants.payment_types.moonpay"
          [fee]="this.fee"
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
        [disabled]="!this.form.valid"
        (click)="this.openMoonpay()"
      >
        {{ 'fiat_ramps.moonpay.button_text' | translate }}
      </ion-button>
    </ion-footer>
  `,
  styleUrls: ['./moonpay.page.scss'],
})
export class MoonpayPage {
  form: UntypedFormGroup = this.formBuilder.group({
    cryptoAmount: ['', Validators.required],
    fiatAmount: ['', Validators.required],
  });
  coins: Coin[];
  selectedCurrency: Coin;
  address: string;
  operationsList: FiatRampOperation[];
  provider: FiatRampProvider;
  country: FiatRampProviderCountry;
  fiatCurrency = 'USD';
  countries = COUNTRIES;
  fee = { value: 0, token: '' };
  price: number;
  milliseconds = 15000;
  destroy$: Subject<void>;
  minimumFiatAmount: number;
  minBuyAmount: number;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private browserService: BrowserService,
    private fiatRampsService: FiatRampsService,
    private navController: NavController,
    private apiWalletService: ApiWalletService,
    private providers: ProvidersFactory,
    private walletMaintenance: WalletMaintenanceService,
    private tokenOperationDataService: TokenOperationDataService,
    private modalController: ModalController,
    private wallets: WalletsFactory,
    private blockchains: BlockchainsFactory,
    private moonpayPrice: DynamicMoonpayPriceFactory
  ) {}

  async ionViewWillEnter() {
    this.destroy$ = new Subject<void>();
    this.provider = this.getProviders().byAlias('moonpay');
    this.setCountry();
    this.setFiatToken();
    this.setCryptoToken();
    await this.initAssetsForm();
    this.cryptoPrice();
    this.getLimits();
    this.setInitValue();
    this.subscribeToFormChanges();
  }

  ionViewDidLeave() {
    this.walletMaintenance.wipeDataFromService();
  }

  setInitValue() {
    this.form.patchValue({ fiatAmount: 0 });
    this.form.patchValue({ cryptoAmount: 0 });
  }

  async initAssetsForm() {
    await this.walletMaintenance.getEncryptedWalletFromStorage();
    this.coins = await this.providerTokens();
  }

  getLimits() {
    this.fiatRampsService
      .getMoonpayLimitOfBuyQuote(this.tokenOperationDataService.tokenOperationData.asset.toLowerCase(), 'usd')
      .subscribe((res) => {
        this.minBuyAmount = res.quoteCurrency.minBuyAmount;
        this.calculateMinimumFiatAmount(this.price);
        this.addGreaterThanValidator(this.minimumFiatAmount);
      });
  }

  calculateMinimumFiatAmount(price: number) {
    this.minimumFiatAmount = price * this.minBuyAmount;
  }

  private addDefaultValidators() {
    this.form.get('fiatAmount').addValidators(Validators.required);
  }

  private clearValidators() {
    this.form.get('fiatAmount').clearValidators();
  }

  private addGreaterThanValidator(amount) {
    this.clearValidators();
    this.addDefaultValidators();
    this.form.get('fiatAmount').addValidators(CustomValidators.greaterOrEqualThan(amount));
    this.form.get('fiatAmount').updateValueAndValidity();
  }

  async providerTokens() {
    return await new ProviderTokensOf(this.getProviders(), this.apiWalletService.getCoins(), this.fiatRampsService).byAlias(
      this.provider.alias
    );
  }

  getProviders(): Providers {
    return this.providers.create();
  }

  async openMoonpay() {
    const blockchain = this.blockchains.create().oneByName(this.selectedCurrency.network);
    const wallet = await this.wallets.create().oneBy(blockchain);
    this.fiatRampsService
      .getMoonpayRedirectLink(
        wallet.address(),
        this.selectedCurrency.moonpayCode,
        this.fiatCurrency,
        this.form.value.fiatAmount
      )
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
    return this.walletMaintenance.addCoinIfUserDoesNotHaveIt(this.selectedCurrency);
  }

  async openModal(event) {
    const modal = await this.modalController.create({
      component: CoinSelectorModalComponent,
      cssClass: 'ux-modal-skip-backup',
    });
    await modal.present();
  }

  setFiatToken() {
    if (this.country.isoCurrencyCodeMoonpay) {
      this.fiatCurrency = this.country.isoCurrencyCodeMoonpay;
    }
    this.fee.token = this.fiatCurrency;
  }

  async setCryptoToken() {
    const { asset, network } = this.tokenOperationDataService.tokenOperationData;
    this.selectedCurrency = (await this.providerTokens()).find((token) => token.value === asset && token.network === network);
  }

  subscribeToFormChanges() {
    this.form.get('cryptoAmount').valueChanges.subscribe((value) => this.cryptoAmountChange(value));
    this.form.get('fiatAmount').valueChanges.subscribe((value) => this.fiatAmountChange(value));
  }

  private fiatAmountChange(value: number) {
    this.form.patchValue(
      { cryptoAmount: new RoundedNumber(value / this.price).value() },
      this.defaultPatchValueOptions()
    );
    this.getFee();
  }

  private cryptoAmountChange(value: number) {
    this.form.patchValue(
      { fiatAmount: new RoundedNumber(value * this.price).value() },
      this.defaultPatchValueOptions()
    );
    this.getFee();
  }

  async getFee() {
    if (!this.form.value.fiatAmount) {
      this.form.value.fiatAmount = 1;
    }
    this.fiatRampsService
      .getMoonpayBuyQuote(
        new RoundedNumber(Number(this.form.value.fiatAmount)).value(),
        this.selectedCurrency.moonpayCode,
        this.fiatCurrency.toLowerCase()
      )
      .subscribe((res) => {
        this.fee.value = res.totalAmount - res.baseCurrencyAmount;
      });
  }

  private defaultPatchValueOptions() {
    return { emitEvent: false, onlySelf: true };
  }

  setCountry() {
    this.country = this.countries.find(
      (country) => country.isoCodeAlpha3 === this.tokenOperationDataService.tokenOperationData.country
    );
  }

  private cryptoPrice() {
    this.createMoonpayPrice()
      .value()
      .subscribe((price: number) => {
        this.price = price;
        this.calculateMinimumFiatAmount(price);
      });
  }

  createMoonpayPrice(currency = this.fiatCurrency): DynamicMoonpayPrice {
    return this.moonpayPrice.new(
      this.milliseconds,
      new DefaultMoonpayPrice(currency, this.selectedCurrency.moonpayCode, this.fiatRampsService)
    );
  }

  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
