import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { VoidSigner } from 'ethers';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GasFeeOf } from 'src/app/shared/models/gas-fee-of/gas-fee-of.model';
import { NativeGasOf } from 'src/app/shared/models/native-gas-of/native-gas-of';
import { WeiOf } from 'src/app/shared/models/wei-of/wei-of';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { Fee } from '../../defi-investments/shared-defi-investments/interfaces/fee.interface';
import { ERC20Contract } from '../../defi-investments/shared-defi-investments/models/erc20-contract/erc20-contract.model';
import { ERC20ContractInjectable } from '../../defi-investments/shared-defi-investments/models/erc20-contract/injectable/erc20-contract.injectable';
import { ERC20Provider } from '../../defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.interface';
import { Erc20ProviderInjectable } from '../../defi-investments/shared-defi-investments/models/erc20-provider/injectable/erc20-provider.injectable';
import { AmountOf } from '../../swaps/shared-swaps/models/amount-of/amount-of';
import { Blockchain } from '../../swaps/shared-swaps/models/blockchain/blockchain';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { GasStationOfFactory } from '../../swaps/shared-swaps/models/gas-station-of/factory/gas-station-of.factory';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { WalletEncryptionService } from '../../wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { CoinSelectorModalComponent } from '../shared-ramps/components/coin-selector-modal/coin-selector-modal.component';
import { COUNTRIES } from '../shared-ramps/constants/countries';
import { KriptonNetworks } from '../shared-ramps/constants/kripton-networks';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { DefaultKriptonPrice } from '../shared-ramps/models/kripton-price/default-kripton-price';
import { DynamicKriptonPrice } from '../shared-ramps/models/kripton-price/dynamic-kripton-price';
import { DynamicKriptonPriceFactory } from '../shared-ramps/models/kripton-price/factory/dynamic-kripton-price-factory';
import { ProviderTokensOf } from '../shared-ramps/models/provider-tokens-of/provider-tokens-of';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { KriptonStorageService } from '../shared-ramps/services/kripton-storage/kripton-storage.service';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { TokenOperationDataService } from '../shared-ramps/services/token-operation-data/token-operation-data.service';
import RoundedNumber from 'src/app/shared/models/rounded-number/rounded-number';
import { OperationDataInterface } from '../shared-ramps/interfaces/operation-data.interface';
import { UserBankDataService } from '../shared-ramps/services/user-bank-data/user-bank-data.service';

@Component({
  selector: 'app-sell-order',
  template: `<ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref=""></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.cash_out.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="os ion-padding">
      <form [formGroup]="this.form">
        <div class="ux-card no-border">
          <app-provider-new-operation-card
            *ngIf="this.selectedCurrency"
            [blockchain]="this.selectedCurrency.network"
            [coin]="this.selectedCurrency"
            [logoRoute]="this.selectedCurrency.logoRoute"
            [showToken]="true"
            [minimumAmount]="this.minimumCryptoAmount"
            [minimumCurrency]="this.selectedCurrency.value"
            [fiatCurrency]="this.fiatCurrency"
            [provider]="this.provider"
            [coinSelectorEnabled]="true"
            (changeCurrency)="this.openModal($event)"
            paymentType="fiat_ramps.shared.constants.payment_types.kripton"
            [providerFee]="this.providerFee"
            [fee]="this.dynamicFee"
            [debounce]="1500"
          ></app-provider-new-operation-card>
        </div>
        <div *ngIf="!this.agreement" class="os__disclaimer">
          <ion-item class="os__disclaimer__item ion-no-padding ion-no-margin">
            <ion-checkbox formControlName="thirdPartyKYC" mode="md" slot="start"></ion-checkbox>
            <ion-label class="ion-no-padding ion-no-margin">
              <ion-text class="ux-font-text-xxs" color="neutral80">
                {{ 'fiat_ramps.new_operation.thirdPartyKYC' | translate }}
              </ion-text>
            </ion-label>
          </ion-item>

          <ion-item class="os__disclaimer__item ion-no-padding ion-no-margin">
            <ion-checkbox formControlName="thirdPartyTransaction" mode="md" slot="start"></ion-checkbox>
            <ion-label class="ion-no-padding ion-no-margin checkbox-link">
              <ion-text class="ux-font-text-xxs" color="neutral80">
                {{ 'fiat_ramps.new_operation.thirdPartyTransaction' | translate }}
              </ion-text>
            </ion-label>
          </ion-item>

          <ion-item class="os__disclaimer__item ion-no-padding ion-no-margin">
            <ion-checkbox formControlName="acceptTOSAndPrivacyPolicy" mode="md" slot="start"></ion-checkbox>
            <ion-label
              class="ion-no-padding ion-no-margin ux-font-text-xxs"
              color="neutral80"
              [innerHTML]="'fiat_ramps.new_operation.privacyPolicyAndTOS' | translate"
            >
            </ion-label>
          </ion-item>
        </div>
        <div class="os__disclaimer" *ngIf="this.agreement">
          <ion-item class="os__disclaimer__item ion-no-padding ion-no-margin">
            <ion-label
              class="ion-no-padding ion-no-margin ux-font-text-xxs"
              color="neutral80"
              [innerHTML]="'fiat_ramps.new_operation.acceptedprivacyPolicyAndTOS' | translate"
            >
            </ion-label>
          </ion-item>
        </div>
      </form>
    </ion-content>

    <ion-footer class="sw__footer">
      <div class="sw__footer__submit-button ion-padding">
        <ion-button
          class="ux_button sw__footer__submit-button__button"
          appTrackClick
          name="ux_sell_amount_continue"
          color="secondary"
          expand="block"
          [appLoading]="this.isLoading"
          [loadingText]="'fiat_ramps.cash_out.loading' | translate"
          (click)="this.handleSubmit()"
          [disabled]="!this.form.valid"
          >{{ 'wallets.send.send_detail.continue_button' | translate }}</ion-button
        >
      </div>
    </ion-footer> `,
  styleUrls: ['./sell-order.page.scss'],
})
export class SellOrderPage {
  form: UntypedFormGroup = this.formBuilder.group({
    cryptoAmount: [0, [Validators.required]],
    fiatAmount: [0, [Validators.required]],
    thirdPartyKYC: [false, [Validators.requiredTrue]],
    thirdPartyTransaction: [false, [Validators.requiredTrue]],
    acceptTOSAndPrivacyPolicy: [false, [Validators.requiredTrue]],
  });
  selectedCurrency: Coin;
  agreement: boolean;
  fee = { value: 0, token: '' };
  providerFee = { value: undefined, token: '', totalDigits: 0, maxDecimals: 0 };
  dynamicFee = { value: undefined, token: undefined, totalDigits: 0, maxDecimals: 0 };

  providerTokens: Coin[];
  fiatCurrency: string;
  country: any;
  coin: any;
  provider: FiatRampProvider;
  priceRefreshInterval = 15000;
  destroy$: Subject<void>;
  kriptonNetworks = KriptonNetworks;
  fiatPrice: number;
  minimumCryptoAmount: number;
  blockchain: Blockchain;
  paymentMethodId: number;
  isLoading: boolean;
  constructor(
    private fiatRampsService: FiatRampsService,
    private storageOperationService: StorageOperationService,
    private tokenOperationDataService: TokenOperationDataService,
    private walletEncryptionService: WalletEncryptionService,
    private navController: NavController,
    private formBuilder: UntypedFormBuilder,
    private kriptonDynamicPrice: DynamicKriptonPriceFactory,
    private apiWalletService: ApiWalletService,
    private http: HttpClient,
    private storageService: StorageService,
    private providers: ProvidersFactory,
    private modalController: ModalController,
    private kriptonStorageService: KriptonStorageService,
    private blockchains: BlockchainsFactory,
    private gasStation: GasStationOfFactory,
    private erc20ProviderInjectable: Erc20ProviderInjectable,
    private erc20ContractInjectable: ERC20ContractInjectable,
    private userBankDataService: UserBankDataService
  ) {}

  async ionViewWillEnter() {
    this.destroy$ = new Subject<void>();
    this.provider = this.getProviders().byAlias('kripton');
    this.fiatRampsService.setProvider(this.provider.id.toString());
    this.checkKriptonAgreement();
    await this.availableCoins();
    this.setCountry();
    this.setCurrency();
    this.setCoin();
    this.dynamicPrice();
    this.setBlockchain(this.selectedCurrency.network);
    this.subscribeToFormChanges();
  }

  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async checkKriptonAgreement(): Promise<void> {
    this.agreement = await this.kriptonStorageService.get('privacy_and_policy_accepted');
    if (this.agreement) {
      this.form.patchValue({ thirdPartyKYC: true, thirdPartyTransaction: true, acceptTOSAndPrivacyPolicy: true });
    }
  }

  async availableCoins() {
    this.providerTokens = await new ProviderTokensOf(
      this.getProviders(),
      this.apiWalletService.getCoins(),
      this.fiatRampsService
    ).byAlias('kripton');
  }

  subscribeToFormChanges() {
    this.form.get('cryptoAmount').valueChanges.subscribe((value) => {
      this.cryptoAmountChange(value);
    });
    this.form.get('fiatAmount').valueChanges.subscribe((value) => {
      this.fiatAmountChange(value);
    });
  }

  private async fiatAmountChange(value: any) {
    value = parseFloat(value);
    let price = this.fiatPrice;
    if (this.form.value.fiatAmount !== 0 && this.form.value.cryptoAmount !== 0) {
      price = this.form.value.fiatAmount / this.form.value.cryptoAmount;
    }
    this.form.patchValue(
      { cryptoAmount: new RoundedNumber(value / price, 6).value() },
      { emitEvent: false, onlySelf: true }
    );
    await this.getUpdatedValues();
  }

  private async cryptoAmountChange(value: any) {
    await this.getUpdatedValues(parseFloat(value));
  }

  private async userWallet(): Promise<string> {
    return await this.storageService.getWalletsAddresses(this.blockchain.name());
  }

  private setBlockchain(aBlockchainName: string) {
    this.blockchain = this.blockchains.create().oneByName(aBlockchainName);
  }

  private gasPrice(): Promise<AmountOf> {
    return this.gasStation.create(this.blockchain).price().standard();
  }

  private async estimatedGas(): Promise<number> {
    return await this._estimatedFee();
  }

  private async _estimatedFee(): Promise<number> {
    return this.selectedCurrency.native
      ? (await (await this.estimatedNativeGas()).value()).toNumber()
      : (await (await this.estimatedNonNativeGas()).value()).toNumber();
  }

  private async estimatedNativeGas(): Promise<Fee> {
    return new NativeGasOf(this.erc20Provider(), {
      to: await this.userWallet(),
      value: new WeiOf(this.form.value.cryptoAmount || 1, this.selectedCurrency).value(),
    });
  }

  private async estimatedNonNativeGas(): Promise<Fee> {
    return new GasFeeOf((await this.erc20Contract()).value(), 'transfer', [
      await this.userWallet(),
      new WeiOf(this.form.value.cryptoAmount, this.selectedCurrency).value(),
    ]);
  }

  erc20Provider(): ERC20Provider {
    return this.erc20ProviderInjectable.create(this.selectedCurrency);
  }

  async erc20Contract(): Promise<ERC20Contract> {
    return this.erc20ContractInjectable.create(this.erc20Provider(), new VoidSigner(await this.userWallet()));
  }

  async setAllFeeData(): Promise<void> {
    this.loadingFee();
    await this.setFee();
    this.dynamicFee = {
      value: this.fee.value,
      token: this.selectedCurrency.network,
      totalDigits: 14,
      maxDecimals: this.blockchain.nativeToken().decimals(),
    };
  }

  private loadingFee(): void {
    this.dynamicFee.value = undefined;
  }

  private async setFee(): Promise<void> {
    this.fee.value = (await this.gasPrice()).times(await this.estimatedGas()).value();

    if (this.selectedCurrency.native) {
      this.fee.value *= 1.25;
    }
  }

  createKriptonDynamicPrice(currency = this.fiatCurrency): DynamicKriptonPrice {
    return this.kriptonDynamicPrice.new(
      this.priceRefreshInterval,
      new DefaultKriptonPrice(currency, this.selectedCurrency, 'cash-out', this.http)
    );
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
    this.fee.token = this.selectedCurrency.network;
  }

  setCoin() {
    this.coin = this.tokenOperationDataService.tokenOperationData;
  }

  private _network(): string {
    return this.kriptonNetworks[this.selectedCurrency.network];
  }

  private dynamicPrice() {
    this.createKriptonDynamicPrice()
      .value()
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (price: number) => {
        this.fiatPrice = 1 / price;

        if (!this.minimumCryptoAmount) {
          await this.getMinimumCryptoAmount();
        } else if (this.form.value.fiatAmount || this.form.value.cryptoAmount) {
          this.getUpdatedValues();
        }
      });
  }

  private async getMinimumCryptoAmount() {
    const data = { email: await this._getUserEmail() };
    const response = await this.fiatRampsService
      .getKriptonMinimumAmount(this.selectedCurrency.value, 'cash-out', data)
      .toPromise();

    this.minimumCryptoAmount = parseFloat(response.minimun_general);

    this.addGreaterThanValidator(this.minimumCryptoAmount);
    await this.getUpdatedValues(this.minimumCryptoAmount);
  }

  private _getUserEmail() {
    return this.kriptonStorageService.get('email');
  }

  async getUpdatedValues(cryptoAmount?: number) {
    const amount = cryptoAmount ? cryptoAmount : this.form.value.cryptoAmount;
    const kriptonFeeResponse = await this.fiatRampsService
      .getKriptonFee(this.selectedCurrency.value, amount, this.fiatCurrency, this._network(), 'cash-out')
      .toPromise();
    this.setProviderFee(parseFloat(kriptonFeeResponse.data.costs));
    this.form.patchValue(
      { fiatAmount: parseFloat(kriptonFeeResponse.data.amount_out) },
      { emitEvent: false, onlySelf: true }
    );
    this.form.patchValue(
      { cryptoAmount: parseFloat(kriptonFeeResponse.data.amount_in) },
      { emitEvent: false, onlySelf: true }
    );
    this.setAllFeeData();
  }

  setProviderFee(cost: number) {
    this.providerFee.value = cost / this.fiatPrice;
    this.providerFee.token = this.selectedCurrency.value;
    this.providerFee.totalDigits = 14;
    this.providerFee.maxDecimals = this.selectedCurrency.decimals;
  }

  getProviders() {
    return this.providers.create();
  }

  async setOperationStorage() {
    const data: OperationDataInterface = {
      country: this.country.name,
      type: 'cash-out',
      amount_in: this.form.value.cryptoAmount,
      amount_out: this.form.value.fiatAmount,
      currency_in: this.selectedCurrency.value,
      currency_out: this.fiatCurrency,
      price_in: '1',
      price_out: this.fiatPrice,
      wallet: await this.walletAddress(),
      provider: this.provider.id.toString(),
      network: this.selectedCurrency.network,
      fee: this.fee.value,
      providerFee: this.providerFee.value,
    };
    this.storageOperationService.updateData(data);
  }

  async walletAddress(): Promise<string> {
    return (await this.walletEncryptionService.getEncryptedWallet()).addresses[this.selectedCurrency.network];
  }

  async handleSubmit() {
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;
      await this.setOperationStorage();
      const email = await this.kriptonStorageService.get('email');
      const auth_token = await this.kriptonStorageService.get('access_token');
      this.kriptonStorageService.set('privacy_and_policy_accepted', true);
      const userBankData = Object.assign({ email, auth_token }, this.userBankDataService.userBankData);
      await this.createUserBank(userBankData)
        .then(async ({ id }) => {
          this.paymentMethodId = id;
          const operationData = Object.assign(
            { email, auth_token, payment_method_id: id },
            this.storageOperationService.getData()
          );
          return await this.fiatRampsService.createOperation(operationData).toPromise();
        })
        .then((operationResponse) => {
          const newData = Object.assign(
            {
              operation_id: operationResponse.id,
              created_at: operationResponse.created_at,
              payment_method_id: this.paymentMethodId,
            },
            this.storageOperationService.getData()
          );
          this.storageOperationService.updateData(newData);
          this.navController.navigateRoot('fiat-ramps/kripton-summary');
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }

  async createUserBank(data) {
    return await this.fiatRampsService.registerUserBank(data).toPromise();
  }

  async openModal(event) {
    const modal = await this.modalController.create({
      component: CoinSelectorModalComponent,
      cssClass: 'ux-modal-skip-backup',
    });
    await modal.present();
  }

  private addGreaterThanValidator(amount: number) {
    this.clearValidators();
    this.addDefaultValidators();
    this.form.get('cryptoAmount').addValidators(CustomValidators.greaterOrEqualThan(amount));
    this.form.get('cryptoAmount').updateValueAndValidity();
  }

  private addDefaultValidators() {
    this.form.get('cryptoAmount').addValidators(Validators.required);
  }

  private clearValidators() {
    this.form.get('cryptoAmount').clearValidators();
  }
}
