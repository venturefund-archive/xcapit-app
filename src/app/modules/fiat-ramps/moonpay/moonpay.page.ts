import { Component } from '@angular/core';
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
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { COUNTRIES } from '../shared-ramps/constants/countries';
import { FiatRampProviderCountry } from '../shared-ramps/interfaces/fiat-ramp-provider-country';
import RoundedNumber from 'src/app/shared/models/rounded-number/rounded-number';
import { DefaultMoonpayPrice } from '../shared-ramps/models/moonpay-price/default-moonpay-price';
import { DynamicMoonpayPrice } from '../shared-ramps/models/moonpay-price/dynamic-moonpay-price';
import { DynamicMoonpayPriceFactory } from '../shared-ramps/models/moonpay-price/factory/dynamic-moonpay-price-factory';
import { Subject, Subscription } from 'rxjs';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { WalletsFactory } from '../../wallets/shared-wallets/models/wallets/factory/wallets.factory';
import { MoonpayPriceInjectable } from '../shared-ramps/models/moonpay-price/injectable/moonpay-price.injectable';
import { ProviderPrice } from '../shared-ramps/models/provider-price/provider-price';

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
          [minimumCurrency]="this.fiatCurrency"
          [provider]="this.provider"
          [coinSelectorEnabled]="true"
          [minimumAmount]="this.minimumFiatAmount"
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
  fee = { value: 0, token: '', totalDigits: 10, maxDecimals: 2 };
  price: number;
  milliseconds = 15000;
  priceSubscription$: Subscription;
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
    private moonpayPrice: DynamicMoonpayPriceFactory,
    private moonpayPriceInjectable: MoonpayPriceInjectable
  ) {}

  async ionViewWillEnter() {
    this.provider = this.getProviders().byAlias('moonpay');
    this.setCountry();
    this.setFiatToken();
    this.setCryptoToken();
    await this.initAssetsForm();
    await this.initCryptoPrice();
    await this.getLimits();
    this.cryptoPrice();
    this.subscribeToFormChanges();
    this.setInitValue();
  }

  ionViewDidLeave() {
    this.walletMaintenance.wipeDataFromService();
  }

  setInitValue() {
    this.form.patchValue({ cryptoAmount: 0 });
    this.form.patchValue({ fiatAmount: new RoundedNumber(this.minimumFiatAmount).value() });
  }

  async initAssetsForm() {
    await this.walletMaintenance.getEncryptedWalletFromStorage();
    this.coins = await this.providerTokens();
  }

  async getLimits() {
    const limits = await this.fiatRampsService
      .getMoonpayLimitOfBuyQuote(
        this.tokenOperationDataService.tokenOperationData.asset.toLowerCase(),
        this.fiatCurrency.toLowerCase()
      )
      .toPromise();
    const quote = await this.buyQuote(1);
    this.fee.value = quote.totalAmount - quote.baseCurrencyAmount;
    this.minBuyAmount = limits.quoteCurrency.minBuyAmount;
    this.calculateMinimumFiatAmount(this.price);
    this.addGreaterThanValidator(this.minimumFiatAmount);
  }

  async buyQuote(value: number): Promise<any> {
    return await this.fiatRampsService
      .getMoonpayBuyQuote(
        value,
        this.selectedCurrency.moonpayCode,
        this.fiatCurrency.toLowerCase()
      )
      .toPromise();
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
    return await new ProviderTokensOf(
      this.getProviders(),
      this.apiWalletService.getCoins(),
      this.fiatRampsService
    ).byAlias(this.provider.alias);
  }

  getProviders(): Providers {
    return this.providers.create();
  }

  async openMoonpay() {
    const blockchain = this.blockchains.create().oneByName(this.selectedCurrency.network);
    const wallet = await this.wallets.create().oneBy(blockchain);
    const link = await this.fiatRampsService
      .getMoonpayRedirectLink(
        wallet.address(),
        this.selectedCurrency.moonpayCode,
        this.fiatCurrency,
        this.form.value.fiatAmount
      )
      .toPromise();
    await this.success();
    await this.browserService.open(link);
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
    this.fee.token = this.country.isoCurrencyCodeMoonpay ? this.country.isoCurrencyCodeMoonpay : this.fiatCurrency;
  }

  async setCryptoToken() {
    const { asset, network } = this.tokenOperationDataService.tokenOperationData;
    this.selectedCurrency = (await this.providerTokens()).find(
      (token) => token.value === asset && token.network === network
    );
  }

  subscribeToFormChanges() {
    this.form.get('cryptoAmount').valueChanges.subscribe((value) => this.cryptoAmountChange(value));
    this.form.get('fiatAmount').valueChanges.subscribe((value) => this.fiatAmountChange(value));
  }

  private fiatAmountChange(value: number) {
    this.getFee(value);
    this.form.patchValue(
      {
        cryptoAmount: new RoundedNumber(value - this.fee.value > 0 ? (value - this.fee.value) / this.price : 0).value(),
      },
      this.defaultPatchValueOptions()
    );
  }

  private cryptoAmountChange(value: number) {
    this.getFee(value * this.price);
    this.form.patchValue(
      { fiatAmount: new RoundedNumber(value * this.price > 0 ? value * this.price + this.fee.value : 0).value() },
      this.defaultPatchValueOptions()
    );
  }

  async getFee(value?: number) {
    if (!this.form.value.fiatAmount) {
      this.form.value.fiatAmount = 1;
    }
    const quote = await this.buyQuote(new RoundedNumber(Number(value || this.form.value.fiatAmount)).value());
    this.fee.value = quote.totalAmount - quote.baseCurrencyAmount;
  }

  private defaultPatchValueOptions() {
    return { emitEvent: false, onlySelf: true };
  }

  setCountry() {
    this.country = this.countries.find(
      (country) => country.isoCodeAlpha3 === this.tokenOperationDataService.tokenOperationData.country
    );
  }

  private async initCryptoPrice() {
    this.price = await this._moonpayPrice(this.fiatCurrency).value().toPromise();
    this.calculateMinimumFiatAmount(this.price);
  }

  private cryptoPrice() {
    this.priceSubscription$ = this.createMoonpayPrice()
      .value()
      .subscribe((price: number) => {
        this.price = price;
        this.calculateMinimumFiatAmount(price);
      });
  }

  createMoonpayPrice(currency = this.fiatCurrency): DynamicMoonpayPrice {
    return this.moonpayPrice.new(this.milliseconds, this._moonpayPrice(currency));
  }

  private _moonpayPrice(currency: string): ProviderPrice {
    return this.moonpayPriceInjectable.create(currency.toLowerCase(), this.selectedCurrency.moonpayCode);
  }

  ionViewWillLeave() {
    this.priceSubscription$.unsubscribe();
  }
}
