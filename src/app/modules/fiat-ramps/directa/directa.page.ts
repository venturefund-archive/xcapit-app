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
import { DirectaPrice } from '../shared-ramps/models/directa-price/directa-price';
import { DirectaPriceFactory } from '../shared-ramps/models/directa-price/factory/directa-price-factory';
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
  mininumUSDAmount = 2;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private apiWalletService: ApiWalletService,
    private providers: ProvidersFactory,
    private walletMaintenance: WalletMaintenanceService,
    private tokenOperationDataService: TokenOperationDataService,
    private directaPrice: DirectaPriceFactory,
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
    this.subscribeToFormChanges();
  }

  setCountry() {
    this.country = this.countries.find(
      (country) => country.isoCodeAlpha3 === this.tokenOperationDataService.tokenOperationData.country
    );
  }

  setFiatToken() {
    this.fiatCurrency = this.country.isoCurrencyCodeDirecta;
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
    return `${this.envService.byKey('apiUrl')}/on_off_ramps/directa/deposit_link`;
  }

  async depositData(): Promise<DirectaDepositCreationData> {
    return {
      amount: this.form.value.fiatAmount,
      fiat_token: this.fiatCurrency,
      crypto_token: this.selectedCurrency.value,
      country: this.country.directaCode,
      payment_method: this.provider.alias,
      back_url: 'https://nonprod.xcapit.com/tabs/wallets',
      success_url: 'https://nonprod.xcapit.com/tabs/wallets',
      error_url: 'https://nonprod.xcapit.com/tabs/wallets',
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
    this.form.get('cryptoAmount').valueChanges.subscribe((value) => this.cryptoAmountChange(value));
    this.form.get('fiatAmount').valueChanges.subscribe((value) => this.fiatAmountChange(value));
  }

  private cryptoAmountChange(value: number) {
    this.form.patchValue(
      { fiatAmount: new RoundedNumber(value * this.price).value() },
      { emitEvent: false, onlySelf: true }
    );
  }

  private fiatAmountChange(value: number) {
    const roundedValue = new RoundedNumber(value).value();
    this.form.patchValue({ fiatAmount: roundedValue }, { emitEvent: false, onlySelf: true });
    this.form.patchValue({ cryptoAmount: roundedValue / this.price }, { emitEvent: false, onlySelf: true });
  }

  private updateAmounts(): void {
    this.form.patchValue({ fiatAmount: new RoundedNumber(this.form.value.cryptoAmount * this.price).value() });
  }

  private addDefaultValidators() {
    this.form.get('cryptoAmount').addValidators(Validators.required);
  }

  private clearValidators() {
    this.form.get('cryptoAmount').clearValidators();
  }
  private addGreaterThanValidator(amount) {
    this.clearValidators();
    this.addDefaultValidators();
    this.form.get('cryptoAmount').addValidators(CustomValidators.greaterOrEqualThan(amount));
    this.form.get('cryptoAmount').updateValueAndValidity();
  }

  private cryptoPrice() {
    this.createDirectaPrice()
      .value()
      .pipe(takeUntil(this.destroy$))
      .subscribe((price: number) => {
        this.price = price;
        if (this.form.value.fiatAmount) this.updateAmounts();
        this.usdCryptoPrice();
      });
  }

  private usdCryptoPrice() {
    this.createDirectaPrice('USD')
      .value()
      .pipe(takeUntil(this.destroy$))
      .subscribe((price: number) => {
        this.minimumCryptoAmount = this.mininumUSDAmount / price;
        this.minimumFiatAmount = this.minimumCryptoAmount * this.price;
        this.addGreaterThanValidator(this.minimumCryptoAmount);
      });
  }

  createDirectaPrice(currency = this.fiatCurrency): DirectaPrice {
    return this.directaPrice.new(this.milliseconds, currency, this.selectedCurrency, this.fiatRampsService);
  }

  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
