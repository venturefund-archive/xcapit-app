import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Coin } from '../../shared-wallets/interfaces/coin.interface';
import { ModalController, NavController } from '@ionic/angular';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TransactionDataService } from '../../shared-wallets/services/transaction-data/transaction-data.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { UX_ALERT_TYPES } from 'src/app/shared/components/ux-alert-message/ux-alert-types';
import { WalletService } from '../../shared-wallets/services/wallet/wallet.service';
import { StorageService } from '../../shared-wallets/services/storage-wallets/storage-wallets.service';
import { ApiWalletService } from '../../shared-wallets/services/api-wallet/api-wallet.service';
import { NativeGasOf } from 'src/app/shared/models/native-gas-of/native-gas-of';
import { GasFeeOf } from '../../../../shared/models/gas-fee-of/gas-fee-of.model';
import { ERC20Contract } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-contract/erc20-contract.model';
import { VoidSigner } from 'ethers';
import { ERC20ProviderController } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/controller/erc20-provider.controller';
import { ERC20ContractController } from '../../../defi-investments/shared-defi-investments/models/erc20-contract/controller/erc20-contract.controller';
import { ERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.interface';
import { parseUnits } from 'ethers/lib/utils';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynamicPriceFactory } from '../../../../shared/models/dynamic-price/factory/dynamic-price-factory';
import { Amount } from 'src/app/modules/defi-investments/shared-defi-investments/types/amount.type';
import { ToastWithButtonsComponent } from 'src/app/modules/defi-investments/shared-defi-investments/components/toast-with-buttons/toast-with-buttons.component';
import { TranslateService } from '@ngx-translate/core';
import { InfoSendModalComponent } from '../../shared-wallets/components/info-send-modal/info-send-modal.component';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TokenOperationDataService } from 'src/app/modules/fiat-ramps/shared-ramps/services/token-operation-data/token-operation-data.service';
import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { RawBlockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { GasStationOfFactory } from 'src/app/modules/swaps/shared-swaps/models/gas-station-of/factory/gas-station-of.factory';
import { AmountOf } from 'src/app/modules/swaps/shared-swaps/models/amount-of/amount-of';
import { Fee } from 'src/app/modules/defi-investments/shared-defi-investments/interfaces/fee.interface';
import { Token } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { RawToken } from 'src/app/modules/swaps/shared-swaps/models/token-repo/token-repo';

@Component({
  selector: 'app-send-detail',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button
            appTrackClick
            name="ux_nav_go_back"
            defaultHref="/wallets/send/select-currency"
          ></ion-back-button>
        </ion-buttons>
        <ion-title class="sd__header ion-text-left">{{ 'wallets.send.send_detail.header' | translate }}</ion-title>
        <ion-label class="step-counter" slot="end">2 {{ 'shared.step_counter.of' | translate }} 3</ion-label>
      </ion-toolbar>
    </ion-header>
    <ion-content class="sd">
      <div class="sd__network-select-card ion-padding" *ngIf="this.tplBlockchain">
        <div class="sd__network-select-card__title">
          <ion-text class="ux-font-text-lg">{{ 'wallets.send.send_detail.network_select.title' | translate }}</ion-text>
        </div>
        <div class="sd__network-select-card__selected-coin">
          <app-coin-selector [selectedCoin]="this.token" [enabled]="true" (changeCurrency)="this.changeCurrency()"></app-coin-selector>
        </div>
        <div class="sd__network-select-card__networks">
          <app-network-select-card
            [title]="'wallets.send.send_detail.network_select.network' | translate"
            [networks]="[this.tplBlockchain.name]"
            [selectedNetwork]="this.tplBlockchain.name"
          ></app-network-select-card>
        </div>
      </div>
      <form [formGroup]="this.form">
        <div
          class="sd__address-input-card  ion-padding-start ion-padding-end"
          *ngIf="this.token && this.tplBlockchain"
        >
          <app-address-input-card
            [title]="'wallets.send.send_detail.address_input.title' | translate"
            [helpText]="'wallets.send.send_detail.address_input.help_text' | translate: { currency: this.token.value }"
            [selectedNetwork]="this.tplBlockchain.name"
          ></app-address-input-card>
        </div>
        <div class="sd__amount-input-card" *ngIf="this.token">
          <ion-card class="ux-card">
            <app-amount-input-card
              *ngIf="this.balance !== undefined"
              [title]="'defi_investments.shared.amount_input_card.title' | translate"
              [header]="'defi_investments.shared.amount_input_card.available' | translate"
              [showRange]="false"
              [baseCurrency]="this.token"
              [max]="this.balance"
              [quotePrice]="this.quotePrice"
              [feeToken]="this.tplNativeToken"
              [amountSend]="true"
              (phraseAmountInfoClicked)="this.showPhraseAmountInfo()"
            ></app-amount-input-card>
            <app-amount-input-card-skeleton
              *ngIf="this.balance === undefined"
              [showRange]="false"
            ></app-amount-input-card-skeleton>
            <div class="ion-padding-start ion-padding-end">
              <app-transaction-fee
                [fee]="this.dynamicFee"
                [quoteFee]="this.quoteFee"
                [balance]="this.nativeBalance"
                [defaultFeeInfo]="true"
              ></app-transaction-fee>
            </div>
          </ion-card>
        </div>
      </form>
    </ion-content>
    <ion-footer class="sd__footer">
      <div class="sd__footer__submit-button ion-padding">
        <ion-button
          class="ux_button sd__footer__submit-button__button"
          appTrackClick
          name="ux_send_continue"
          (click)="this.submitForm()"
          [disabled]="!this.form.valid || !this.tplBlockchain || !this.quoteFee.value"
          color="secondary"
          >{{ 'wallets.send.send_detail.continue_button' | translate }}</ion-button
        >
      </div>
    </ion-footer>
  `,
  styleUrls: ['./send-detail.page.scss'],
})
export class SendDetailPage {
  private activeBlockchain: Blockchain;
  private nativeToken: Token;
  tplNativeToken: RawToken;
  tplBlockchain: RawBlockchain;

  destroy$ = new Subject<void>();
  private priceRefreshInterval = 15000;
  alertType = UX_ALERT_TYPES.warning;
  token: Coin;
  balance: number;
  nativeBalance: number;
  amount: number;
  quotePrice: number;
  nativeTokenPrice: number;
  fee: number;
  dynamicFee: Amount = { value: 0, token: undefined };
  quoteFee: Amount = { value: 0, token: 'USD' };
  modalHref: string;
  isInfoModalOpen = false;

  url: string;
  form: UntypedFormGroup = this.formBuilder.group({
    address: ['', [Validators.required, CustomValidators.isAddress()]],
    amount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
    quoteAmount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
  });

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private formBuilder: UntypedFormBuilder,
    private transactionDataService: TransactionDataService,
    private walletService: WalletService,
    private storageService: StorageService,
    private apiWalletService: ApiWalletService,
    private erc20ProviderController: ERC20ProviderController,
    private erc20ContractController: ERC20ContractController,
    private dynamicPriceFactory: DynamicPriceFactory,
    private modalController: ModalController,
    private translate: TranslateService,
    private storage: IonicStorageService,
    private tokenOperationDataService: TokenOperationDataService,
    private blockchains: BlockchainsFactory,
    private gasStation: GasStationOfFactory
  ) {}

  async ionViewDidEnter() {
    this.modalHref = window.location.href;
    this.setBlockchain(this.route.snapshot.queryParamMap.get('network'));
    this.setTokens();
    this.getPrices();
    this.setUrlToBuyCrypto();
    await this.tokenBalances();
  }

  private gasPrice(): Promise<AmountOf> {
    return this.gasStation.create(this.activeBlockchain).price().standard();
  }

  private setBlockchain(aBlockchainName: string) {
    this.activeBlockchain = this.blockchains.create().oneByName(aBlockchainName);
    this.tplBlockchain = this.activeBlockchain.json();
  }

  private getPrices(): void {
    this.setNativePrice();
    this.setQuotePrice();
  }

  private setNativePrice(): void {
    this.getDynamicPriceOf(this.nativeToken.json()).subscribe((price: number) => {
      this.nativeTokenPrice = price;
    });
  }

  private setQuotePrice(): void {
    this.getDynamicPriceOf(this.token.native ? this.nativeToken.json() : this.token).subscribe((price: number) => {
      this.quotePrice = price;
    });
  }

  async showPhraseAmountInfo() {
    if (!this.isInfoModalOpen) {
      this.isInfoModalOpen = true;
      const modal = await this.modalController.create({
        component: InfoSendModalComponent,
        componentProps: {
          title: this.translate.instant('wallets.shared_wallets.info_send_modal.title_send_amount'),
          description: this.translate.instant('wallets.shared_wallets.info_send_modal.description'),
          buttonText: this.translate.instant('wallets.shared_wallets.info_send_modal.button_text'),
        },
        cssClass: 'ux-xxs-modal-informative',
        backdropDismiss: false,
      });
      await modal.present();
      this.isInfoModalOpen = false;
    }
  }

  private async userWallet(): Promise<string> {
    return await this.storageService.getWalletsAddresses(this.activeBlockchain.name());
  }

  private setTokens() {
    this.token = this.apiWalletService.getCoin(
      this.route.snapshot.queryParamMap.get('asset'),
      this.activeBlockchain.name()
    );
    this.nativeToken = this.activeBlockchain.nativeToken();
    this.tplNativeToken = this.nativeToken.json();
    this.dynamicFee.token = this.nativeToken.symbol();
  }

  async tokenBalances() {
    const tokenBalance = parseFloat(await this.userBalanceOf(this.token));
    this.watchFormChanges();
    if (this.token.native) {
      await this.setAllFeeData();
      this.resetFee();
      this.balance = this.nativeBalance = Math.max(tokenBalance - this.fee, 0);
    } else {
      this.balance = tokenBalance;
      this.nativeBalance = parseFloat(await this.userBalanceOf(this.nativeToken.json()));
    }
    await this.checkEnoughBalance();
    this.addLowerThanValidator();
  }

  private addLowerThanValidator() {
    this.form.get('amount').addValidators(CustomValidators.lowerThanEqual(this.balance));
    this.form.get('amount').updateValueAndValidity();
  }

  private async userBalanceOf(_aToken: Coin|RawToken) {
    return this.walletService.balanceOf(await this.userWallet(), _aToken.value);
  }

  private watchFormChanges() {
    this.form.valueChanges.subscribe(async () => {
      if (this.form.valid) {
        await this.setAllFeeData();
      } else this.resetFee();
    });
  }

  private loadingFee(): void {
    this.dynamicFee.value = this.quoteFee.value = undefined;
  }

  private async setAllFeeData(): Promise<void> {
    this.loadingFee();
    await this.setFee();
    this.dynamicFee = { value: this.fee, token: this.nativeToken.symbol() };
    this.getQuoteFee();
  }

  private getQuoteFee(): void {
    this.quoteFee.value = this.nativeTokenPrice * this.fee;
  }

  private resetFee() {
    this.dynamicFee.value = this.quoteFee.value = 0;
  }

  async erc20Contract(): Promise<ERC20Contract> {
    return this.erc20ContractController.new(this.erc20Provider(), new VoidSigner(await this.userWallet()));
  }

  erc20Provider(): ERC20Provider {
    return this.erc20ProviderController.new(this.token);
  }

  private async setFee(): Promise<void> {
    this.fee = (await this.gasPrice()).times(await this.estimatedGas()).value();
  }

  private async estimatedGas(): Promise<number> {
    return this.token.native ? (await (await this.estimatedNativeGas()).value()).toNumber()
      : (await (await this.estimatedNonNativeGas()).value()).toNumber();
  }

  private async estimatedNativeGas(): Promise<Fee> {
    return new NativeGasOf(this.erc20Provider(), {
      to: await this.userWallet(),
      value: this.parseWei(1),
    });
  }

  private async estimatedNonNativeGas(): Promise<Fee> {
    return new GasFeeOf((await this.erc20Contract()).value(), 'transfer', [
      this.form.value.address,
      this.parseWei(this.form.value.amount),
    ]);
  }

  parseWei(amount: number) {
    return parseUnits(amount.toFixed(this.token.decimals), this.token.decimals);
  }

  async submitForm() {
    if (this.form.valid) {
      await this.saveTransactionData();
      await this.goToSummary();
    }
  }

  async goToSummary() {
    await this.navController.navigateForward(['/wallets/send/summary']);
  }

  private async saveTransactionData() {
    this.transactionDataService.transactionData = {
      network: this.activeBlockchain.name(),
      currency: this.token,
      address: this.form.value.address,
      amount: this.form.value.amount,
      referenceAmount: this.form.value.quoteAmount,
      balanceNativeToken: this.nativeBalance,
      balance: this.balance,
      fee: this.fee.toString(),
      referenceFee: this.quoteFee.value.toString(),
    };
  }

  changeCurrency() {
    this.navController.navigateBack(['/wallets/send/select-currency']);
  }

  private getDynamicPriceOf(token: Coin|RawToken): Observable<number> {
    return this.dynamicPriceFactory
      .new(this.priceRefreshInterval, token, this.apiWalletService)
      .value()
      .pipe(takeUntil(this.destroy$));
  }

  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async checkEnoughBalance() {
    if (this.nativeBalance < this.fee) {
      this.openModalBalance();
    }
  }

  async setUrlToBuyCrypto() {
    const conditionsPurchasesAccepted = await this.storage.get('conditionsPurchasesAccepted');
    this.tokenOperationDataService.tokenOperationData = {
      asset: this.nativeToken?.value,
      network: this.nativeToken?.network,
    };
    this.url = !conditionsPurchasesAccepted ? 'fiat-ramps/buy-conditions' : 'fiat-ramps/select-provider';
    return this.url;
  }

  async openModalBalance() {
    const modal = await this.modalController.create({
      component: ToastWithButtonsComponent,
      cssClass: 'ux-toast-warning-with-margin',
      showBackdrop: false,
      id: 'feeModal',
      componentProps: {
        text: this.translate.instant('defi_investments.confirmation.informative_modal_fee', {
          nativeToken: this.nativeToken.symbol(),
        }),
        firstButtonName: this.translate.instant('defi_investments.confirmation.buy_button', {
          nativeToken: this.nativeToken.symbol(),
        }),
        secondaryButtonName: this.translate.instant('defi_investments.confirmation.deposit_button', {
          nativeToken: this.nativeToken.symbol(),
        }),
        firstLink: this.url,
        secondLink: '/wallets/receive/detail',
        data: this.nativeToken.json(),
      },
    });
    await this.modalController.dismiss(null, null, 'feeModal');
    if (window.location.href === this.modalHref) {
      await modal.present();
    }
    await modal.onDidDismiss();
  }
}
