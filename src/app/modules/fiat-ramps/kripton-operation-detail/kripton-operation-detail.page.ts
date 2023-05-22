import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LINKS } from 'src/app/config/static-links';
import { InformationModalComponent } from 'src/app/shared/components/information-modal/information-modal.component';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { ScanUrlOf } from '../../wallets/shared-wallets/models/scan-url-of/scan-url-of';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { COUNTRIES } from '../shared-ramps/constants/countries';
import { OPERATION_STATUS } from '../shared-ramps/constants/operation-status';
import { FiatRampOperation } from '../shared-ramps/interfaces/fiat-ramp-operation.interface';
import { FiatRampProvider } from '../shared-ramps/interfaces/fiat-ramp-provider.interface';
import { OperationDataInterface } from '../shared-ramps/interfaces/operation-data.interface';
import { OperationStatus } from '../shared-ramps/interfaces/operation-status.interface';
import { ProvidersFactory } from '../shared-ramps/models/providers/factory/providers.factory';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { KriptonStorageService } from '../shared-ramps/services/kripton-storage/kripton-storage.service';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { Countries } from '../shared-ramps/models/countries/countries';
import { CountryRepo } from '../shared-ramps/models/country-repo/country-repo';
import { Country } from '../shared-ramps/models/country/country';
import { TransactionReceiptOf } from '../shared-ramps/models/transaction-receipt-of/transaction-receipt-of';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { JsonRpcProviderInjectable } from '../../wallets/shared-wallets/models/json-rpc-provider/injectable/json-rpc-provider.injectable';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { GasStationOfFactory } from '../../swaps/shared-swaps/models/gas-station-of/factory/gas-station-of.factory';
import { Blockchain } from '../../swaps/shared-swaps/models/blockchain/blockchain';
import { NativeGasOf } from 'src/app/shared/models/native-gas-of/native-gas-of';
import { StorageService } from '../../wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { Fee } from '../../defi-investments/shared-defi-investments/interfaces/fee.interface';
import { GasFeeOf } from 'src/app/shared/models/gas-fee-of/gas-fee-of.model';
import { Erc20ProviderInjectable } from '../../defi-investments/shared-defi-investments/models/erc20-provider/injectable/erc20-provider.injectable';
import { ERC20ContractInjectable } from '../../defi-investments/shared-defi-investments/models/erc20-contract/injectable/erc20-contract.injectable';
import { VoidSigner } from 'ethers';
import { ERC20Contract } from '../../defi-investments/shared-defi-investments/models/erc20-contract/erc20-contract.model';
import { ERC20Provider } from '../../defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.interface';
import { AmountOf } from '../../swaps/shared-swaps/models/amount-of/amount-of';
import { ProviderTokensOf } from '../shared-ramps/models/provider-tokens-of/provider-tokens-of';
import { WeiOf } from 'src/app/shared/models/wei-of/wei-of';
import { BankAccount } from '../shared-ramps/types/bank-account.type';
@Component({
  selector: 'app-kripton-operation-detail',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/purchases"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.kripton_operation_detail.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding kod">
      <div class="kod__card-container">
        <ion-card class="kod__card-container__card ux-card-new ion-no-margin" *ngIf="this.operation">
          <div class="kod__card-container__card__title">
            <ion-text class="ux-font-text-xl">
              {{ 'fiat_ramps.kripton_operation_detail.title.' + this.operation.operation_type | translate }}
            </ion-text>
          </div>
          <app-coin-content-item
            [imgRoute]="this.imgRoute"
            [currencyOut]="this.operation.currency_out"
            [network]="this.operation.network"
            [amount]="this.operation.amount_out"
            [quoteAmount]="this.operation.amount_in"
            [currencyIn]="this.operation.currency_in"
          ></app-coin-content-item>
          <ion-item class="kod__card-container__card__state ion-no-margin ion-no-padding" (click)="this.openScan()">
            <div class="kod__card-container__card__state__container">
              <div class="kod__card-container__card__state__container__title">
                <ion-text class="ux-font-titulo-xs">
                  {{ 'fiat_ramps.kripton_operation_detail.state' | translate }}
                </ion-text>
                <ion-icon
                  *ngIf="this.operation.status !== 'complete'"
                  name="information-circle"
                  (click)="this.showStateInformation()"
                  color="info"
                ></ion-icon>
              </div>
              <div class="kod__card-container__card__state__container__status">
                <app-operation-status-chip
                  [operationType]="this.operation.operation_type"
                  [statusName]="this.operation.status"
                ></app-operation-status-chip>
                <ion-text *ngIf="this.operation.tx_hash" class="ux-link-xs"
                  >{{ 'fiat_ramps.kripton_operation_detail.scan_link' | translate }}
                  {{ 'fiat_ramps.kripton_operation_detail.scans.' + this.operation.network | translate }}</ion-text
                >
              </div>
              <app-operation-status-alert
                *ngIf="
                  (this.isCashIn && this.operation.status !== 'received' && this.operation.status !== 'complete') ||
                  (!this.isCashIn && this.operation.status === 'wait')
                "
                [operationType]="this.operation.operation_type"
                [operationStatus]="this.operation.status"
                (navigateBy)="this.navigateBy()"
              ></app-operation-status-alert>
            </div>
          </ion-item>

          <ion-item class="kod__card-container__card__quotation ion-no-margin ion-no-padding">
            <div class="kod__card-container__card__quotation__container">
              <div class="kod__card-container__card__quotation__container__title">
                <ion-text class="ux-font-titulo-xs">
                  {{ 'fiat_ramps.kripton_operation_detail.quotation' | translate }}
                </ion-text>
              </div>
              <div class="kod__card-container__card__quotation__container__content">
                <ion-text class="ux-font-text-base">
                  1
                  {{ (this.isCashIn ? this.operation.currency_out : this.operation.currency_in) | uppercase }}
                  =
                  {{ this.conversionRate | number : '1.2-2' }}
                  {{ (this.isCashIn ? this.operation.currency_in : this.operation.currency_out) | uppercase }}
                </ion-text>
              </div>
            </div>
          </ion-item>

          <ion-item class="kod__card-container__card__fee ion-no-margin ion-no-padding" *ngIf="this.operation.fiat_fee">
            <div class="kod__card-container__card__fee__container">
              <div class="kod__card-container__card__fee__container__title">
                <ion-text class="ux-font-titulo-xs">
                  {{ 'fiat_ramps.kripton_operation_detail.provider_fee' | translate }}
                </ion-text>
              </div>
              <div class="kod__card-container__card__fee__container__content">
                <ion-text class="ux-font-text-base">
                  {{ this.operation.fiat_fee / this.conversionRate | formattedAmount }}
                  {{ this.operation.currency_in | uppercase }}
                </ion-text>
              </div>
            </div>
          </ion-item>

          <ion-item class="kod__card-container__card__fee ion-no-margin ion-no-padding" *ngIf="!this.isCashIn">
            <div class="kod__card-container__card__fee__container">
              <div class="kod__card-container__card__fee__container__title">
                <ion-text class="ux-font-titulo-xs">
                  {{
                    (this.operation.status === 'wait'
                      ? 'fiat_ramps.kripton_operation_detail.estimated_fee'
                      : 'fiat_ramps.kripton_operation_detail.fee'
                    ) | translate
                  }}
                </ion-text>
              </div>
              <div class="kod__card-container__card__fee__container__content">
                <ion-skeleton-text *ngIf="!this.estimatedFee" animated></ion-skeleton-text>
                <ion-text *ngIf="this.estimatedFee" class="ux-font-text-base">
                  {{ this.estimatedFee | formattedAmount }}
                  {{ 'MATIC' }}
                </ion-text>
              </div>
            </div>
          </ion-item>

          <ion-item class="kod__card-container__card__address ion-no-margin ion-no-padding">
            <div class="kod__card-container__card__address__container">
              <div class="kod__card-container__card__address__container__title">
                <ion-text class="ux-font-titulo-xs">
                  {{
                    (this.isCashIn
                      ? 'fiat_ramps.kripton_operation_detail.address'
                      : 'fiat_ramps.kripton_operation_detail.bank_account'
                    ) | translate
                  }}
                </ion-text>
              </div>
              <div class="kod__card-container__card__address__container__content">
                <ion-text *ngIf="(!this.isCashIn && this.bankAccount) || this.isCashIn" class="ux-font-text-base">
                  {{ this.isCashIn ? this.operation.wallet_address : this.bankAccount.account_number }}
                </ion-text>
                <ion-skeleton-text *ngIf="!this.isCashIn && !this.bankAccount" animated></ion-skeleton-text>
              </div>
            </div>
          </ion-item>

          <ion-item class="kod__card-container__card__provider ion-no-margin ion-no-padding">
            <div class="kod__card-container__card__provider__container">
              <div class="kod__card-container__card__provider__container__provider">
                <div class="kod__card-container__card__provider__container__provider__title">
                  <ion-text class="ux-font-titulo-xs">
                    {{ 'fiat_ramps.kripton_operation_detail.provider' | translate }}
                  </ion-text>
                </div>
                <div class="kod__card-container__card__provider__container__provider__content">
                  <img src="assets/img/provider-logos/KriptonMarket.svg" />

                  <ion-text class="ux-font-text-base"> Kripton Market </ion-text>
                </div>
              </div>
              <div class="kod__card-container__card__provider__container__operation">
                <div class="kod__card-container__card__provider__container__operation__title">
                  <ion-text class="ux-font-titulo-xs">
                    {{ 'fiat_ramps.kripton_operation_detail.operation' | translate }}
                  </ion-text>
                </div>
                <div class="kod__card-container__card__provider__container__operation__content">
                  <ion-text class="ux-font-text-base"> N° {{ this.operation.operation_id }} </ion-text>
                </div>
              </div>
            </div>
          </ion-item>

          <ion-item class="kod__card-container__card__date ion-no-margin ion-no-padding" lines="none">
            <div class="kod__card-container__card__date__container">
              <div class="kod__card-container__card__date__container__date">
                <div class="kod__card-container__card__date__container__date__title">
                  <ion-text class="ux-font-titulo-xs">
                    {{ 'fiat_ramps.kripton_operation_detail.date' | translate }}
                  </ion-text>
                </div>
                <div class="kod__card-container__card__date__container__date__content">
                  <ion-text class="ux-font-text-base">
                    {{ this.operation.created_at | date : 'dd/MM/YYYY' }}
                  </ion-text>
                </div>
              </div>
              <div class="kod__card-container__card__date__container__hour">
                <div class="kod__card-container__card__date__container__hour__content">
                  <ion-text class="ux-font-text-base">
                    {{ this.operation.created_at | date : 'HH:mm'
                    }}{{ 'fiat_ramps.kripton_operation_detail.hours' | translate }}
                  </ion-text>
                </div>
              </div>
            </div>
          </ion-item>
        </ion-card>
      </div>
      <div class="kod__disclaimer">
        <div class="kod__disclaimer__header">
          <ion-text class="ux-font-text-base">
            {{ 'fiat_ramps.kripton_operation_detail.support.header' | translate }}
          </ion-text>
        </div>
        <div class="kod__disclaimer__link">
          <ion-button
            name="ux_goto_kripton_tos"
            class="ux-link-xs ion-no-margin ion-no-padding"
            fill="clear"
            (click)="this.navigateToKriptonTOS()"
            size="small"
          >
            {{ 'fiat_ramps.kripton_operation_detail.support.link' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./kripton-operation-detail.page.scss'],
})
export class KriptonOperationDetailPage {
  provider: FiatRampProvider;
  operation: FiatRampOperation;
  token: Coin;
  status: OperationStatus;
  isInfoModalOpen = false;
  description: string;
  description2: string;
  country: Country;
  imgRoute: string;
  conversionRate: number;
  isCashIn: boolean;
  bankAccount: BankAccount;
  transactionFee: number;
  blockchain: Blockchain;
  providerTokens: Coin[];
  estimatedFee: number;

  constructor(
    private browserService: BrowserService,
    private route: ActivatedRoute,
    private providersFactory: ProvidersFactory,
    private fiatRampsService: FiatRampsService,
    private apiWalletService: ApiWalletService,
    private navController: NavController,
    private trackService: TrackService,
    private modalController: ModalController,
    private translate: TranslateService,
    private storageOperationService: StorageOperationService,
    private kriptonStorageService: KriptonStorageService,
    private blockchains: BlockchainsFactory,
    private jsonRpcProviderInjectable: JsonRpcProviderInjectable,
    private gasStation: GasStationOfFactory,
    private storageService: StorageService,
    private erc20ProviderInjectable: Erc20ProviderInjectable,
    private erc20ContractInjectable: ERC20ContractInjectable
  ) {}

  async ionViewWillEnter() {
    const operationId = this.route.snapshot.paramMap.get('operation_id');
    this.provider = this.providersFactory.create().byAlias('kripton');
    await this.availableCoins();
    this.getUserOperation(operationId);
    this.trackScreenViewEvent();
  }

  async navigateToKriptonTOS() {
    await this.browserService.open({
      url: LINKS.kriptonSupport,
    });
  }

  private getCountry() {
    this.country = new Countries(new CountryRepo(COUNTRIES)).findByCurrencyCode(
      this.isCashIn ? this.operation.currency_in.toUpperCase() : this.operation.currency_out.toUpperCase()
    );
  }

  private _getOperationStatus(): OperationStatus {
    return OPERATION_STATUS.find((statuses) => statuses.type === this.operation.operation_type).statuses.find(
      (status) => status.name === this.operation.status
    );
  }

  async showStateInformation() {
    if (!this.isInfoModalOpen) {
      this.isInfoModalOpen = true;
      const modal = await this.modalController.create({
        component: InformationModalComponent,
        componentProps: {
          title: this.translate.instant('fiat_ramps.operation_status_detail.title'),
          status: this.status,
          description: this.description,
          description2: this.description2,
          buttonText: this.translate.instant('fiat_ramps.operation_status_detail.button'),
          operationType: this.operation.operation_type,
        },
        cssClass: 'modal',
        backdropDismiss: false,
      });
      await modal.present();
      this.isInfoModalOpen = false;
    }
  }

  private _setText(operationType: string, status: string) {
    this.description = this.translate.instant(
      `fiat_ramps.operation_status_detail.${operationType}.${status}.description`
    );
    if (status === 'incomplete') {
      this.description2 =
        operationType === 'cash-in'
          ? this.translate.instant(`fiat_ramps.operation_status_detail.${operationType}.${status}.description2`)
          : '';
    }
  }

  private async getUserOperation(operationId: string) {
    const email = await this.kriptonStorageService.get('email');
    const auth_token = await this.kriptonStorageService.get('access_token');
    this.fiatRampsService.setProvider(this.provider.id.toString());
    this.fiatRampsService.getUserSingleOperation(operationId, { email, auth_token }).subscribe({
      next: (data) => {
        this.operation = data[0];
        this.setOperationType();
        this.getCoin();
        this.getCountry();
        this.status = this._getOperationStatus();
        this._setText(this.operation.operation_type, this.status.textToShow);
        this.setDataToShow();
      },
      error: () => {
        this.navigateBackToOperations();
      },
    });
  }

  private setOperationType() {
    this.isCashIn = this.operation.operation_type === 'cash-in';
  }

  async setDataToShow() {
    if (this.isCashIn) {
      this.setCashInData();
    } else if (!this.isCashIn && this.status.textToShow !== 'incomplete' && this.operation.tx_hash) {
      this.setCashOutData();
      await this.setCashOutData();
      const transactionReceipt: TransactionReceipt = await new TransactionReceiptOf(
        this.operation.tx_hash,
        this.jsonRpcProviderInjectable.create(this.blockchain.rpc())
      ).value();
      this.transactionFee = transactionReceipt.gasUsed.mul(transactionReceipt.effectiveGasPrice).toNumber();
    } else if (!this.isCashIn && this.status.textToShow === 'incomplete') {
      await this.setCashOutData();
      this.estimatedFee = await this._fee();
    }
  }

  setCashInData() {
    this.imgRoute = this.token.logoRoute;
    this.conversionRate = this.operation.amount_in / this.operation.amount_out;
  }

  async setCashOutData() {
    this.imgRoute = this.country.flagRoute();
    this.conversionRate = this.operation.amount_out / this.operation.amount_in;
    this.blockchain = this.blockchains.create().oneByName(this.token.network);
    this.bankAccount = await this.userBank();
  }

  async userBank() {
    const auth_token = await this.kriptonStorageService.get('access_token');
    const email = await this.kriptonStorageService.get('email');
    return await this.fiatRampsService
      .getUserBank({
        email,
        auth_token,
        payment_method_id: Number(this.operation.payment_method_id),
      })
      .toPromise();
  }

  providers() {
    return this.providersFactory.create();
  }

  async availableCoins() {
    this.providerTokens = await new ProviderTokensOf(
      this.providers(),
      this.apiWalletService.getCoins(),
      this.fiatRampsService
    ).byAlias('kripton');
  }

  getCoin() {
    const asset = this.fiatRampsService
      .getProvider(1)
      .currencies.find((c) => c.symbol === (this.isCashIn ? this.operation.currency_out : this.operation.currency_in));
    this.token = this.providerTokens.find(
      (currency) => currency.value === asset.symbol && currency.network === asset.network
    );
  }

  navigateBackToOperations() {
    this.navController.navigateBack(['/fiat-ramps/purchases']);
  }

  trackScreenViewEvent() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_buy_kripton_screenview_details',
    });
  }

  async navigateBy() {
    await this.setOperationStorage();
    return this.isCashIn
      ? this.navController.navigateForward('/fiat-ramps/purchase-order/1', { animated: false })
      : this.navController.navigateForward('/fiat-ramps/kripton-summary', { animated: false });
  }

  async setOperationStorage() {
    const data: OperationDataInterface = {
      country: this.country.name(),
      type: this.operation.operation_type,
      amount_in: this.operation.amount_in,
      amount_out: this.operation.amount_out,
      currency_in: this.operation.currency_in,
      currency_out: this.operation.currency_out,
      price_in: '',
      wallet: '',
      price_out: this.conversionRate,
      provider: this.provider.id.toString(),
      network: this.token.network,
      operation_id: this.operation.operation_id,
      created_at: this.operation.created_at,
      providerFee: this.operation.fiat_fee / this.conversionRate,
      fee: this.estimatedFee,
      payment_method_id: this.operation.payment_method_id,
    };
    this.storageOperationService.updateData(data);
  }

  openScan() {
    if (this.operation.status === 'complete') {
      const url = ScanUrlOf.create(this.operation.tx_hash, this.operation.network).value();
      this.browserService.open({ url });
    }
  }

  private async userWallet(): Promise<string> {
    return await this.storageService.getWalletsAddresses(this.blockchain.name());
  }

  private async _fee(): Promise<number> {
    let fee = (await this.gasPrice()).times(await this.estimatedGas()).value();
    return this.token.native ? (fee *= 1.25) : fee;
  }

  private gasPrice(): Promise<AmountOf> {
    return this.gasStation.create(this.blockchain).price().standard();
  }

  private async estimatedGas(): Promise<number> {
    return await this._estimatedFee();
  }

  private async _estimatedFee(): Promise<number> {
    return this.token.native
      ? (await (await this.estimatedNativeGas()).value()).toNumber()
      : (await (await this.estimatedNonNativeGas()).value()).toNumber();
  }

  private async estimatedNativeGas(): Promise<Fee> {
    return new NativeGasOf(this.erc20Provider(), {
      to: await this.userWallet(),
      value: new WeiOf(this.operation.amount_in || 1, this.token).value(),
    });
  }

  private async estimatedNonNativeGas(): Promise<Fee> {
    return new GasFeeOf((await this.erc20Contract()).value(), 'transfer', [
      await this.userWallet(),
      new WeiOf(this.operation.amount_in, this.token).value(),
    ]);
  }

  erc20Provider(): ERC20Provider {
    return this.erc20ProviderInjectable.create(this.token);
  }

  async erc20Contract(): Promise<ERC20Contract> {
    return this.erc20ContractInjectable.create(this.erc20Provider(), new VoidSigner(await this.userWallet()));
  }
}
