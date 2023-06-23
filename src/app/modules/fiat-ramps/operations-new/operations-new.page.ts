import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { BrowserService } from '../../../shared/services/browser/browser.service';
import { COUNTRIES } from '../shared-ramps/constants/countries';
import { FiatRampProviderCountry } from '../shared-ramps/interfaces/fiat-ramp-provider-country';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { DynamicKriptonPriceFactory } from '../shared-ramps/models/kripton-price/factory/dynamic-kripton-price-factory';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { ProviderTokensOf } from '../shared-ramps/models/provider-tokens-of/provider-tokens-of';
import { TokenOperationDataService } from '../shared-ramps/services/token-operation-data/token-operation-data.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { OperationDataInterface } from '../shared-ramps/interfaces/operation-data.interface';
import { DynamicKriptonPrice } from '../shared-ramps/models/kripton-price/dynamic-kripton-price';
import { DefaultKriptonPrice } from '../shared-ramps/models/kripton-price/default-kripton-price';
import { takeUntil } from 'rxjs/operators';
import { KriptonStorageService } from '../shared-ramps/services/kripton-storage/kripton-storage.service';
import RoundedNumber from 'src/app/shared/models/rounded-number/rounded-number';
import { KriptonNetworks } from '../shared-ramps/constants/kripton-networks';
import { SimplifiedWallet } from '../../wallets/shared-wallets/models/simplified-wallet/simplified-wallet';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
@Component({
  selector: 'app-new-kripton-operation',
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
      <div class="provider-name">
        <ion-text class="ux-font-text-xxs">{{ 'fiat_ramps.shared.validation_content.provider' | translate }}</ion-text>
      </div>
    </ion-header>

    <ion-content class="ion-padding anko">
      <div class="anko__content">
        <div class="anko__content__text-header" *ngIf="this.userHasSimpliedWallet">
          <ion-text class="anko__content__text-header__title ux-font-text-xl">{{
            'fiat_ramps.new_operation.title' | translate
          }}</ion-text>
          <ion-text class="anko__content__text-header__description ux-font-text-base-primary">{{
            'fiat_ramps.new_operation.description' | translate
          }}</ion-text>
        </div>

        <form [formGroup]="this.form" class="anko__content__form">
          <div class="anko__content__form__content">
            <ion-card class="anko__content__form__content__card ux-card-new">
              <div
                class="anko__content__form__content__card__amount-select"
                *ngIf="this.selectedCurrency && this.fiatCurrency"
              >
                <div class="anko__content__form__content__card__amount-select__qty-label">
                  <ion-label class="ux-font-titulo-xs">{{
                    'fiat_ramps.shared.provider_new_operation_card.quantity' | translate
                  }}</ion-label>
                </div>
                <div class="anko__content__form__content__card__amount-select__labels">
                  <ion-label
                    class="ux-font-text-xs anko__content__form__content__card__amount-select__labels__base"
                    color="primary"
                  >
                    {{ this.fiatCurrency | uppercase }}</ion-label
                  >
                  <ion-label
                    class="ux-font-text-xs anko__content__form__content__card__amount-select__labels__quote"
                    color="primary"
                  >
                    {{ this.selectedCurrency.value }}
                  </ion-label>
                </div>
                <div class="anko__content__form__content__card__amount-select__inputs">
                  <div class="anko__content__form__content__card__amount-select__inputs__quoteAmount">
                    <ion-input
                      appNumberInput
                      appCommaToDot
                      [debounce]="1500"
                      [class.invalid]="
                        (!this.form.controls.fiatAmount.valid || !this.form.controls.cryptoAmount.valid) &&
                        (this.form.controls.cryptoAmount.touched ||
                          this.form.controls.cryptoAmount.dirty ||
                          this.form.controls.fiatAmount.touched ||
                          this.form.controls.fiatAmount.dirty)
                      "
                      formControlName="fiatAmount"
                      type="text"
                      inputmode="decimal"
                    ></ion-input>
                  </div>
                  <ion-text class="anko__content__form__content__card__amount-select__inputs__equal ux-fweight-medium "
                    >=</ion-text
                  >
                  <div class="anko__content__form__content__card__amount-select__inputs__amount">
                    <ion-input
                      appNumberInput
                      appCommaToDot
                      [debounce]="1500"
                      [class.invalid]="
                        (!this.form.controls.fiatAmount.valid || !this.form.controls.cryptoAmount.valid) &&
                        (this.form.controls.cryptoAmount.touched ||
                          this.form.controls.cryptoAmount.dirty ||
                          this.form.controls.fiatAmount.touched ||
                          this.form.controls.fiatAmount.dirty)
                      "
                      formControlName="cryptoAmount"
                      type="text"
                      inputmode="decimal"
                    >
                    </ion-input>
                  </div>
                </div>
                <div class="anko__content__form__content__card__amount-select__helpers">
                  <ion-icon
                    *ngIf="
                      (!this.form.controls.fiatAmount.valid || !this.form.controls.cryptoAmount.valid) &&
                      (this.form.controls.cryptoAmount.touched ||
                        this.form.controls.cryptoAmount.dirty ||
                        this.form.controls.fiatAmount.touched ||
                        this.form.controls.fiatAmount.dirty)
                    "
                    color="dangerdark"
                    icon="information-error"
                  ></ion-icon>
                  <ion-label
                    class="ux-font-text-xxs"
                    *ngIf="this.minimumFiatAmount"
                    [ngClass]="
                      (!this.form.controls.fiatAmount.valid || !this.form.controls.cryptoAmount.valid) &&
                      (this.form.controls.cryptoAmount.touched ||
                        this.form.controls.cryptoAmount.dirty ||
                        this.form.controls.fiatAmount.touched ||
                        this.form.controls.fiatAmount.dirty)
                        ? 'anko__content__form__content__card__amount-select__helpers__error'
                        : 'anko__content__form__content__card__amount-select__helpers__no-error'
                    "
                    >{{
                      'fiat_ramps.shared.provider_new_operation_card.input_error.' +
                        (!this.form.controls.fiatAmount.valid ? 'cash-in' : 'cash-out')
                        | translate
                          : {
                              amount: this.minimumFiatAmount | formattedAmount : 10 : 2,
                              currency: this.fiatCurrency | uppercase
                            }
                    }}
                  </ion-label>
                  <ion-skeleton-text
                    animated
                    *ngIf="!this.minimumFiatAmount"
                    class="anko__content__form__content__card__amount-select__helpers__no-error"
                  ></ion-skeleton-text>
                </div>
              </div>
            </ion-card>
            <div class="anko__content__checkbox">
              <ion-item class="anko__content__checkbox__item ion-no-padding ion-no-margin">
                <ion-checkbox formControlName="thirdPartyKYC" mode="md" slot="start"></ion-checkbox>
                <ion-label class="ion-no-padding ion-no-margin">
                  <ion-text class="ux-font-text-xxs" color="neutral80">
                    {{ 'fiat_ramps.new_operation.thirdPartyKYC' | translate }}
                  </ion-text>
                </ion-label>
              </ion-item>
            </div>
            <div class="anko__content__disclaimer">
              <ion-label
                class="ion-no-padding ion-no-margin ux-font-text-xs"
                color="neutral80"
                [innerHTML]="'fiat_ramps.new_operation.privacyPolicyAndTOS' | translate"
              >
              </ion-label>
            </div>
          </div>
        </form>
      </div>
    </ion-content>
    <ion-footer>
      <div class="ux_footer ion-padding">
        <div class="button-next">
          <ion-button
            class="ux_button"
            appTrackClick
            (click)="this.handleSubmit()"
            name="ux_buy_kripton_continue"
            color="secondary"
            size="large"
            [disabled]="!this.form.valid"
          >
            {{ 'fiat_ramps.new_operation.next_button' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-footer>
  `,
  styleUrls: ['./operations-new.page.scss'],
})
export class OperationsNewPage implements AfterViewInit {
  anchors: any;
  provider: FiatRampProvider;
  providerTokens: Coin[];
  selectedCurrency: Coin;
  fiatCurrency: string;
  country: FiatRampProviderCountry;
  fiatPrice: number;
  priceRefreshInterval = 15000;
  destroy$: Subject<void>;
  minimumFiatAmount: number;
  agreement: boolean;
  form: UntypedFormGroup = this.formBuilder.group({
    cryptoAmount: ['', [Validators.required]],
    fiatAmount: ['', [Validators.required]],
    thirdPartyKYC: [false, [Validators.requiredTrue]],
  });
  fee = { value: 0, token: '' };
  fiatFee = { value: 0, token: '', maxDigits: 10, totalDecimals: 2 };
  kriptonNetworks = KriptonNetworks;
  userHasSimpliedWallet: boolean;

  constructor(
    public submitButtonService: SubmitButtonService,
    private formBuilder: UntypedFormBuilder,
    private fiatRampsService: FiatRampsService,
    private navController: NavController,
    private storageOperationService: StorageOperationService,
    private walletEncryptionService: WalletEncryptionService,
    private apiWalletService: ApiWalletService,
    private elementRef: ElementRef,
    private browserService: BrowserService,
    private http: HttpClient,
    private kriptonDynamicPrice: DynamicKriptonPriceFactory,
    private providers: ProvidersFactory,
    private tokenOperationDataService: TokenOperationDataService,
    private kriptonStorageService: KriptonStorageService,
    private ionicStorageService: IonicStorageService
  ) {}

  ngAfterViewInit() {
    this.anchors = this.elementRef.nativeElement.querySelectorAll('a');
    this.anchors.forEach((anchor) => {
      anchor.addEventListener('click', this.handleAnchorClick.bind(this));
    });
  }

  handleAnchorClick(event: Event) {
    event.preventDefault();
    const anchor = event.target as HTMLAnchorElement;
    this.navigateToLink(anchor.getAttribute('href'));
  }

  async navigateToLink(link) {
    await this.browserService.open({
      url: link,
    });
  }

  private async setWalletType() {
    this.userHasSimpliedWallet = await new SimplifiedWallet(this.ionicStorageService).value();
  }

  async ionViewWillEnter() {
    this.destroy$ = new Subject<void>();
    this.provider = this.getProviders().byAlias('kripton');
    this.fiatRampsService.setProvider(this.provider.id.toString());
    await this.setWalletType();
    this.checkKriptonAgreement();
    await this.availableCoins();
    this.setCountry();
    this.setCurrency();
    this.subscribeToFormChanges();
    this.dynamicPrice();
  }

  async availableCoins() {
    this.providerTokens = await new ProviderTokensOf(
      this.getProviders(),
      this.apiWalletService.getCoins(),
      this.fiatRampsService
    ).byAlias('kripton');
  }

  getProviders() {
    return this.providers.create();
  }

  subscribeToFormChanges() {
    this.form.get('cryptoAmount').valueChanges.subscribe((value) => {
      this.cryptoAmountChange(value);
    });
    this.form.get('fiatAmount').valueChanges.subscribe((value) => {
      this.fiatAmountChange(value);
    });
  }

  private async cryptoAmountChange(value: any) {
    value = value ? value : this.form.value.cryptoAmount;
    value = parseFloat(value);
    this.form.patchValue(
      { fiatAmount: new RoundedNumber((value + this.fee.value) * this.fiatPrice).value() },
      { emitEvent: false, onlySelf: true }
    );
    await this.getUpdatedValues();
  }

  private async fiatAmountChange(value: any) {
    await this.getUpdatedValues(parseFloat(value));
  }

  private addDefaultValidators() {
    this.form.get('fiatAmount').addValidators(Validators.required);
  }

  private clearValidators() {
    this.form.get('fiatAmount').clearValidators();
  }
  private addGreaterThanValidator(amount: number) {
    this.clearValidators();
    this.addDefaultValidators();
    this.form.get('fiatAmount').addValidators(CustomValidators.greaterOrEqualThan(amount));
    this.form.get('fiatAmount').updateValueAndValidity();
  }

  private dynamicPrice() {
    this.createKriptonDynamicPrice()
      .value()
      .pipe(takeUntil(this.destroy$))
      .subscribe((price: number) => {
        this.fiatPrice = price;
        if (!this.minimumFiatAmount) {
          this.getMinimumFiatAmount();
        } else if (this.form.value.fiatAmount || this.form.value.cryptoAmount) {
          this.getUpdatedValues();
        }
      });
  }

  private _getUserEmail() {
    return this.kriptonStorageService.get('email');
  }
  private async getMinimumFiatAmount() {
    const data = { email: await this._getUserEmail() };
    const response = await this.fiatRampsService
      .getKriptonMinimumAmount(this.fiatCurrency, 'cash-in', data)
      .toPromise();
    this.minimumFiatAmount = parseFloat(response.minimun_general);
    this.addGreaterThanValidator(this.minimumFiatAmount);
    await this.getUpdatedValues(this.minimumFiatAmount);
  }

  createKriptonDynamicPrice(currency = this.fiatCurrency): DynamicKriptonPrice {
    return this.kriptonDynamicPrice.new(
      this.priceRefreshInterval,
      new DefaultKriptonPrice(currency, this.selectedCurrency, 'cash-in', this.http)
    );
  }

  async getUpdatedValues(fiatAmount?: number) {
    const fiatAmountAux = fiatAmount ? fiatAmount : this.form.value.fiatAmount;
    const kriptonFeeResponse = await this.fiatRampsService
      .getKriptonFee(this.fiatCurrency, fiatAmountAux, this.selectedCurrency.value, this._network(), 'cash-in')
      .toPromise();
    this.fee.value = parseFloat(kriptonFeeResponse.data.costs);
    this.form.patchValue(
      { fiatAmount: parseFloat(kriptonFeeResponse.data.amount_in) },
      { emitEvent: false, onlySelf: true }
    );
    this.form.patchValue(
      { cryptoAmount: parseFloat(kriptonFeeResponse.data.amount_out) },
      { emitEvent: false, onlySelf: true }
    );
    this.setFiatFee(this.fee);
  }

  setCountry() {
    this.country = COUNTRIES.find(
      (country) => country.isoCodeAlpha3 === this.tokenOperationDataService.tokenOperationData.country
    );
  }

  async setCurrency() {
    const { asset, network } = this.tokenOperationDataService.tokenOperationData;
    this.selectedCurrency = this.providerTokens.find(
      (currency) => currency.value === asset && currency.network === network
    );
    this.fiatCurrency = this.country.fiatCode ? this.country.fiatCode : 'USD';
  }

  async handleSubmit() {
    if (this.form.valid) {
      await this.setOperationStorage();
      const email = await this.kriptonStorageService.get('email');
      const auth_token = await this.kriptonStorageService.get('access_token');
      this.kriptonStorageService.set('privacy_and_policy_accepted', true);
      const operationData = Object.assign({ email, auth_token }, this.storageOperationService.getData());
      const operationResponse = await this.fiatRampsService.createOperation(operationData).toPromise();
      const newData = Object.assign(
        { operation_id: operationResponse.id, created_at: operationResponse.created_at },
        this.storageOperationService.getData()
      );
      this.storageOperationService.updateData(newData);
      this.navController.navigateRoot('/fiat-ramps/purchase-order/1');
    } else {
      this.form.markAllAsTouched();
    }
  }

  async checkKriptonAgreement(): Promise<void> {
    this.agreement = await this.kriptonStorageService.get('privacy_and_policy_accepted');
    if (this.agreement) {
      this.form.patchValue({ thirdPartyKYC: true });
    }
  }

  async setOperationStorage() {
    const data: OperationDataInterface = {
      country: this.country.name,
      type: 'cash-in',
      amount_in: this.form.value.fiatAmount,
      amount_out: this.form.value.cryptoAmount,
      currency_in: this.fiatCurrency,
      currency_out: this.selectedCurrency.value,
      price_in: '1',
      price_out: this.fiatPrice,
      wallet: await this.walletAddress(),
      provider: this.provider.id.toString(),
      network: this.selectedCurrency.network,
      fee: this.fiatFee.value,
    };
    this.storageOperationService.updateData(data);
  }

  async walletAddress(): Promise<string> {
    return (await this.walletEncryptionService.getEncryptedWallet()).addresses[this.selectedCurrency.network];
  }

  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private _network(): string {
    return this.kriptonNetworks[this.selectedCurrency.network];
  }

  setFiatFee(cryptoFee) {
    this.fiatFee.value = cryptoFee.value * this.fiatPrice;
    this.fiatFee.token = this.fiatCurrency.toUpperCase();
  }
}
