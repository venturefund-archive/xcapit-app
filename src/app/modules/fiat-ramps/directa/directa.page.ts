import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
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
import { HttpClient } from '@angular/common/http';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
  tokens: Coin[];
  selectedCurrency: Coin;
  fiatCurrency = 'USD';
  country: FiatRampProviderCountry;
  providerAlias: string;
  price: number;
  miliseconds: 2000;
  destroy$: Subject<void>;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private navController: NavController,
    private apiWalletService: ApiWalletService,
    private providers: ProvidersFactory,
    private walletMaintenance: WalletMaintenanceService,
    private tokenOperationDataService: TokenOperationDataService,
    private directaPrice: DirectaPriceFactory,
    private http: HttpClient,
    private fiatRampsService: FiatRampsService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    const providerAlias = this.route.snapshot.paramMap.get('alias');
    this.provider = this.getProviders().byAlias(providerAlias);
    this.setCountry();
    this.setFiatCurrency();
    this.setCurrency();
    this.cryptoPrice();
    this.subscribeToFormChanges();
  }

  setCountry() {
    this.country = this.countries.find(
      (country) => country.isoCodeAlpha3 === this.tokenOperationDataService.tokenOperationData.country
    );
  }

  setFiatCurrency() {
    this.fiatCurrency = this.country.isoCurrencyCodeDirecta;
  }

  setCurrency() {
    this.tokens = this.providerTokens();
    const { asset, network } = this.tokenOperationDataService.tokenOperationData;
    this.selectedCurrency = this.tokens.find((token) => token.value === asset && token.network === network);
  }

  providerTokens() {
    return new ProviderTokensOf(this.getProviders(), this.apiWalletService.getCoins()).byAlias(this.provider.alias);
  }

  async openD24() {
    await this.addBoughtCoinIfUserDoesNotHaveIt();
    return this.navController.navigateForward(['/tabs/wallets']);
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
    this.form.patchValue({ fiatAmount: value * this.price }, { emitEvent: false, onlySelf: true });
  }

  private fiatAmountChange(value: number) {
    this.form.patchValue({ cryptoAmount: value / this.price }, { emitEvent: false, onlySelf: true });
  }

  private cryptoPrice() {
    this.createDirectaPrice()
      .value()
      .pipe(takeUntil(this.destroy$))
      .subscribe((price: number) => {
        this.price = price;
      });
  }

  createDirectaPrice(): DirectaPrice {
    return this.directaPrice.new(
      this.miliseconds,
      this.fiatCurrency,
      this.selectedCurrency,
      this.http,
      this.fiatRampsService
    );
  }

  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
