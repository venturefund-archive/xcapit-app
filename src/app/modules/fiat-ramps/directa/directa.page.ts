import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { COUNTRIES } from '../shared-ramps/constants/countries';
import { FiatRampProviderCountry } from '../shared-ramps/interfaces/fiat-ramp-provider-country';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { ProviderTokensOf } from '../shared-ramps/models/provider-tokens-of/provider-tokens-of';
import { Providers } from '../shared-ramps/models/providers/providers.interface';
import { WalletMaintenanceService } from '../../wallets/shared-wallets/services/wallet-maintenance/wallet-maintenance.service';
import { TokenOperationDataService } from '../shared-ramps/services/token-operation-data/token-operation-data.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';
import { LanguageService } from '../../../shared/services/language/language.service';
import DepositLinkRequest from '../shared-ramps/models/deposit-link-request/deposit-link-request';
import DepositLinkRequestFactory from '../shared-ramps/models/deposit-link-request/factory/deposit-link-request.factory';
import { BrowserService } from '../../../shared/services/browser/browser.service';
import { DirectaDepositCreationData } from '../shared-ramps/interfaces/directa-deposit-creation-data.interface';
import { EnvService } from '../../../shared/services/env/env.service';
import RoundedNumber from '../../../shared/models/rounded-number/rounded-number';
import CeilOf from 'src/app/shared/models/ceil-of/ceil-of';
import { DynamicDirectaPrice } from '../shared-ramps/models/directa-price/dynamic-directa-price';
import { DefaultDirectaPrice } from '../shared-ramps/models/directa-price/default-directa-price';
import { DynamicDirectaPriceFactory } from '../shared-ramps/models/directa-price/factory/dynamic-directa-price-factory';
import { D24_PAYMENT_TYPES } from '../shared-ramps/constants/payment-types';

@Component({
  selector: 'app-directa',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/select-provider"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.new_operation.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="this.form" class="ux_main">
        <div class="ux_content aon">
          <app-provider-new-operation-card
            *ngIf="this.selectedCurrency"
            [coin]="this.selectedCurrency"
            [fiatCurrency]="this.fiatCurrency"
            [provider]="this.provider"
            [coinSelectorEnabled]="false"
            [minimumFiatAmount]="this.minimumFiatAmount"
            [fee]="this.fee"
            [paymentType]="this.paymentType"
          ></app-provider-new-operation-card>
        </div>
      </form>
    </ion-content>
    <ion-footer>
      <div class="ux_footer ion-padding">
        <div class="ux_footer__content">
          <ion-text class="ux-font-text-xs ux_footer__content__disclaimer"
            >{{ 'fiat_ramps.shared.redirect_footer.text' | translate }}
          </ion-text>
        </div>
        <div class="button-next">
          <ion-button
            class="ux_button"
            appTrackClick
            name="Continue"
            color="secondary"
            size="large"
            [disabled]="!this.form.valid"
            (click)="this.openD24()"
          >
            {{ 'fiat_ramps.new_operation.next_button' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-footer>
  `,
  styleUrls: ['./directa.page.scss'],
})
export class DirectaPage implements OnInit {
  form: UntypedFormGroup = this.formBuilder.group({
    cryptoAmount: ['', Validators.required],
    fiatAmount: ['', Validators.required],
  });
  paymentType: string;
  provider: FiatRampProvider;
  countries = COUNTRIES;
  selectedCurrency: Coin;
  fiatCurrency = 'USD';
  country: FiatRampProviderCountry;
  providerAlias: string;
  price: number;
  milliseconds = 15000;
  destroy$: Subject<void>;
  minimumFiatAmount: number;
  minimumCryptoAmount: number;
  minimumUSDAmount = 10;
  fee = { value: 0, token: '' };

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private apiWalletService: ApiWalletService,
    private providers: ProvidersFactory,
    private walletMaintenance: WalletMaintenanceService,
    private tokenOperationDataService: TokenOperationDataService,
    private directaPrice: DynamicDirectaPriceFactory,
    private fiatRampsService: FiatRampsService,
    private storageService: StorageService,
    private platformService: PlatformService,
    private languageService: LanguageService,
    private depositLinkRequestFactory: DepositLinkRequestFactory,
    private browserService: BrowserService,
    private envService: EnvService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.destroy$ = new Subject<void>();
    const providerAlias = this.route.snapshot.paramMap.get('alias');
    this.provider = this.getProviders().byAlias(providerAlias);
    this.setCountry();
    this.setFiatToken();
    this.setCryptoToken();
    this.cryptoPrice();
    this.usdCryptoPrice();
    this.setPaymentType();
    this.subscribeToFormChanges();
  }

  setCountry() {
    this.country = this.countries.find(
      (country) => country.isoCodeAlpha3 === this.tokenOperationDataService.tokenOperationData.country
    );
  }

  async setPaymentType() {
    const availableDirectaProviders = await this.getProviders().availableDirectaProviders(this.country).toPromise();
    const paymentType = availableDirectaProviders.find((provider) => provider.code === this.provider.alias).paymentType;
    this.paymentType = D24_PAYMENT_TYPES[paymentType];
  }

  setFiatToken() {
    this.fiatCurrency = this.country.isoCurrencyCodeDirecta;
    this.fee.token = this.fiatCurrency;
  }

  setCryptoToken() {
    const { asset, network } = this.tokenOperationDataService.tokenOperationData;
    this.selectedCurrency = this.providerTokens().find((token) => token.value === asset && token.network === network);
  }

  providerTokens() {
    return new ProviderTokensOf(this.getProviders(), this.apiWalletService.getCoins()).byAlias(this.provider.alias);
  }

  depositLinkRequest(depositCreationData: DirectaDepositCreationData): DepositLinkRequest {
    return this.depositLinkRequestFactory.new(depositCreationData);
  }

  userWalletAddress(): Promise<string> {
    return this.storageService.getWalletsAddresses(this.selectedCurrency.network);
  }

  isNativePlatform(): boolean {
    return this.platformService.isNative();
  }

  async userLanguage(): Promise<string> {
    const language = await this.languageService.getSelectedLanguage();
    return language ?? 'es';
  }

  webhookURL(): string {
    return `${this.envService.byKey('apiUrl')}/on_off_ramps/directa/update_status`;
  }

  async depositData(): Promise<DirectaDepositCreationData> {
    const dynamicLinkUrl = this.getDynamicLinkUrl();
    return {
      amount: this.form.value.fiatAmount,
      fiat_token: this.fiatCurrency,
      crypto_token: this.selectedCurrency.value,
      country: this.country.directaCode,
      payment_method: this.provider.alias,
      back_url: dynamicLinkUrl + 'directa-back-url',
      success_url: dynamicLinkUrl + 'directa-success-url',
      error_url: dynamicLinkUrl + 'directa-error-url',
      notification_url: this.webhookURL(),
      logo: 'https://xcapit-foss.gitlab.io/documentation/img/x.svg',
      wallet: await this.userWalletAddress(),
      mobile: this.isNativePlatform(),
      language: await this.userLanguage(),
    };
  }

  async openD24() {
    const response = await this.depositLinkRequest(await this.depositData())
      .response()
      .toPromise();
    if (response.link) this.browserService.open({ url: response.link });
    await this.addBoughtCoinIfUserDoesNotHaveIt();
  }

  getProviders(): Providers {
    return this.providers.create();
  }

  addBoughtCoinIfUserDoesNotHaveIt(): Promise<void> {
    return this.walletMaintenance.addCoinIfUserDoesNotHaveIt(this.selectedCurrency);
  }

  subscribeToFormChanges() {
    this.form
      .get('cryptoAmount')
      .valueChanges.subscribe((value) => (value > 0 ? this.cryptoAmountChange(value) : this.resetInfo('fiatAmount')));
    this.form
      .get('fiatAmount')
      .valueChanges.subscribe((value) => (value > 0 ? this.fiatAmountChange(value) : this.resetInfo('cryptoAmount')));
  }

  resetInfo(aField: string) {
    this.form.patchValue({ [aField]: 0 }, this.defaultPatchValueOptions());
    this.resetFee();
  }
  private cryptoAmountChange(value: number) {
    this.form.patchValue(
      { fiatAmount: new RoundedNumber(value * this.price).value() },
      this.defaultPatchValueOptions()
    );
    this.getFee();
  }

  private fiatAmountChange(value: number) {
    const roundedValue = new RoundedNumber(Number(value)).value();
    this.form.patchValue(
      { fiatAmount: roundedValue, cryptoAmount: roundedValue / this.price },
      this.defaultPatchValueOptions()
    );
    this.getFee();
  }

  private updateAmounts(): void {
    if (this.form.value.fiatAmount && this.form.value.cryptoAmount) {
      this.form.patchValue(
        { fiatAmount: new RoundedNumber(this.form.value.cryptoAmount * this.price).value() },
        this.defaultPatchValueOptions()
      );
    }
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
    this.form.get('fiatAmount').updateValueAndValidity(this.defaultPatchValueOptions());
  }

  private cryptoPrice() {
    this.createDirectaPrice()
      .value()
      .pipe(takeUntil(this.destroy$))
      .subscribe((price: number) => {
        this.price = price;
        this.updateAmounts();
      });
  }

  private usdCryptoPrice() {
    this.createDirectaPrice('USD')
      .value()
      .pipe(takeUntil(this.destroy$))
      .subscribe((price: number) => {
        if (this.price) {
          this.minimumCryptoAmount = this.minimumUSDAmount / price;
          this.minimumFiatAmount = new CeilOf(this.minimumCryptoAmount * this.price).value();
          this.addGreaterThanValidator(this.minimumFiatAmount);
        }
      });
  }

  createDirectaPrice(currency = this.fiatCurrency): DynamicDirectaPrice {
    return this.directaPrice.new(
      this.milliseconds,
      new DefaultDirectaPrice(currency, this.selectedCurrency, this.fiatRampsService)
    );
  }

  loadingFee() {
    this.fee.value = undefined;
  }

  resetFee() {
    this.fee.value = 0;
  }

  getFee() {
    this.loadingFee();
    this.fiatRampsService
      .getDirectaExchangeRate(this.fiatCurrency, this.selectedCurrency.value, this.form.value.fiatAmount)
      .subscribe((res) => (this.fee.value = res.fee * this.price));
  }

  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private defaultPatchValueOptions() {
    return { emitEvent: false, onlySelf: true };
  }

  getDynamicLinkUrl() {
    return this.envService.all().firebase.dynamicLinkUrl;
  }
}
