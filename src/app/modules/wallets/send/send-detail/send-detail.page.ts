import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Coin } from '../../shared-wallets/interfaces/coin.interface';
import { ModalController, NavController } from '@ionic/angular';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TransactionDataService } from '../../shared-wallets/services/transaction-data/transaction-data.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { UX_ALERT_TYPES } from 'src/app/shared/components/ux-alert-message/ux-alert-types';
import { StorageService } from '../../shared-wallets/services/storage-wallets/storage-wallets.service';
import { ApiWalletService } from '../../shared-wallets/services/api-wallet/api-wallet.service';
import { NativeGasOf } from 'src/app/shared/models/native-gas-of/native-gas-of';
import { GasFeeOf } from '../../../../shared/models/gas-fee-of/gas-fee-of.model';
import { ERC20Contract } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-contract/erc20-contract.model';
import { VoidSigner } from 'ethers';
import { ERC20ProviderController } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/controller/erc20-provider.controller';
import { ERC20ContractController } from '../../../defi-investments/shared-defi-investments/models/erc20-contract/controller/erc20-contract.controller';
import { ERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.interface';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynamicPriceFactory } from '../../../../shared/models/dynamic-price/factory/dynamic-price-factory';
import { Amount } from 'src/app/modules/defi-investments/shared-defi-investments/types/amount.type';
import { TranslateService } from '@ngx-translate/core';
import { InfoSendModalComponent } from '../../shared-wallets/components/info-send-modal/info-send-modal.component';
import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { RawBlockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { GasStationOfFactory } from 'src/app/modules/swaps/shared-swaps/models/gas-station-of/factory/gas-station-of.factory';
import { AmountOf } from 'src/app/modules/swaps/shared-swaps/models/amount-of/amount-of';
import { Fee } from 'src/app/modules/defi-investments/shared-defi-investments/interfaces/fee.interface';
import { Token } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { RawToken, TokenRepo } from 'src/app/modules/swaps/shared-swaps/models/token-repo/token-repo';
import { WeiOf } from 'src/app/shared/models/wei-of/wei-of';
import { TokenByAddress } from 'src/app/modules/swaps/shared-swaps/models/token-by-address/token-by-address';
import { BlockchainTokens } from 'src/app/modules/swaps/shared-swaps/models/blockchain-tokens/blockchain-tokens';
import { DefaultTokens } from 'src/app/modules/swaps/shared-swaps/models/tokens/tokens';
import { TokenDetail } from '../../shared-wallets/models/token-detail/token-detail';
import { FixedTokens } from 'src/app/modules/swaps/shared-swaps/models/filtered-tokens/fixed-tokens';
import { TokenDetailInjectable } from '../../shared-wallets/models/token-detail/injectable/token-detail.injectable';
import { CovalentBalancesController } from '../../shared-wallets/models/balances/covalent-balances/covalent-balances.controller';
import { TokenPricesController } from '../../shared-wallets/models/prices/token-prices/token-prices.controller';
import { WalletsFactory } from 'src/app/modules/swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { Wallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';
import { SolanaNativeSendTx } from '../../shared-wallets/models/solana-native-send-tx/solana-native-send-tx';
import { SolanaFeeOfInjectable } from '../../shared-wallets/models/solana-fee-of/injectable/solana-fee-of-injectable';
import { BuyOrDepositTokenToastComponent } from 'src/app/modules/fiat-ramps/shared-ramps/components/buy-or-deposit-token-toast/buy-or-deposit-token-toast.component';
import { ContactDataService } from 'src/app/modules/contacts/shared-contacts/services/contact-data/contact-data.service';
import { Contact } from 'src/app/modules/contacts/shared-contacts/interfaces/contact.interface';

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
      <form [formGroup]="this.form">
        <div class="sd__transaction-card ion-padding" *ngIf="this.token && this.tplBlockchain">
          <app-asset-detail
            [blockchain]="this.tplBlockchain.name"
            [token]="this.token.value"
            [tokenLogo]="this.token.logoRoute"
          ></app-asset-detail>
          <app-address-input-card
            [title]="'wallets.send.send_detail.address_input.title' | translate"
            [subtitle]="'wallets.send.send_detail.address_input.subtitle' | translate"
            [helpText]="'wallets.send.send_detail.address_input.help_text' | translate: { currency: this.token.value }"
            [selectedNetwork]="this.tplBlockchain.name"
            [addressFromContact]="this.addressFromContact"
            [contact]="this.contact?.name"
            (addFromContacts)="navigateToContacts()"
            (removeContact)="removeContact()"
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
  tplNativeToken: RawToken;
  tplBlockchain: RawBlockchain;
  destroy$ = new Subject<void>();
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
  tokenSolana: Token;
  tplTokenSolana: RawToken;
  tokenDetail: TokenDetail;
  addressFromContact = false;
  contact: Contact;
  private wallet: Wallet;
  private tokenObj: Token;
  private nativeToken: Token;
  private blockchain: Blockchain;
  private priceRefreshInterval = 15000;

  form: UntypedFormGroup = this.formBuilder.group({
    address: ['', [Validators.required]],
    amount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
    quoteAmount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
  });

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private formBuilder: UntypedFormBuilder,
    private transactionDataService: TransactionDataService,
    private walletsFactory: WalletsFactory,
    private storageService: StorageService,
    private apiWalletService: ApiWalletService,
    private erc20ProviderController: ERC20ProviderController,
    private erc20ContractController: ERC20ContractController,
    private dynamicPriceFactory: DynamicPriceFactory,
    private modalController: ModalController,
    private translate: TranslateService,
    private blockchains: BlockchainsFactory,
    private gasStation: GasStationOfFactory,
    private tokenDetailInjectable: TokenDetailInjectable,
    private covalentBalancesFactory: CovalentBalancesController,
    private tokenPricesFactory: TokenPricesController,
    private solanaFeeOf: SolanaFeeOfInjectable,
    private contactDataService: ContactDataService
  ) {}

  async ionViewWillEnter() {
    this.setBlockchain(this.route.snapshot.paramMap.get('blockchain'));
    this.contact = this.contactDataService.getContact();
    if (this.contact) {
      this.setFormData(this.route.snapshot.paramMap.get('amount'));
    }
    await this.setAddressValidator();
  }

  async ionViewDidEnter() {
    this.modalHref = window.location.href;
    await this.setTokens();
    await this.setWallet();
    await this.setTokenDetail();
    this.getPrices();
    await this.tokenBalances();
  }

  setFormData(amount: string) {
    this.form.patchValue({ address: this.contact.address, amount });
    this.addressFromContact = true;
  }

  async setAddressValidator() {
    if (this._isSolana()) {
      this.form.get('address').addValidators(CustomValidators.isAddressSolana());
    } else {
      this.form.get('address').addValidators(CustomValidators.isAddress());
    }
  }

  private gasPrice(): Promise<AmountOf> {
    return this.gasStation.create(this.blockchain).price().standard();
  }

  private setBlockchain(aBlockchainName: string) {
    this.blockchain = this.blockchains.create().oneByName(aBlockchainName);
    this.tplBlockchain = this.blockchain.json();
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
        cssClass: 'modal',
        backdropDismiss: false,
      });
      await modal.present();
      this.isInfoModalOpen = false;
    }
  }

  private async userWallet(): Promise<string> {
    return await this.storageService.getWalletsAddresses(this.blockchain.name());
  }

  private async setTokens() {
    this.tokenObj = await new TokenByAddress(
      this.route.snapshot.paramMap.get('token'),
      new BlockchainTokens(this.blockchain, new DefaultTokens(new TokenRepo(this.apiWalletService.getCoins())))
    ).value();
    this.token = this.tokenObj.json();
    this.nativeToken = this.blockchain.nativeToken();
    this.tplNativeToken = this.nativeToken.json();
    this.dynamicFee.token = this.nativeToken.symbol();
  }

  private async setTokenDetail() {
    this.tokenDetail = await this.tokenDetailOf(this.tokenObj);
    this.balance = this.tokenDetail.balance;
  }

  private async setWallet() {
    this.wallet = await this.walletsFactory.create().oneBy(this.blockchain);
  }

  private async tokenDetailOf(aToken: Token) {
    const tokenDetail = this.tokenDetailInjectable.create(
      this.covalentBalancesFactory.new(this.wallet.address(), new FixedTokens([aToken])),
      this.tokenPricesFactory.new(new FixedTokens([aToken])),
      aToken
    );
    await tokenDetail.cached();
    await tokenDetail.fetch();

    return tokenDetail;
  }

  async tokenBalances() {
    this.watchFormChanges();
    if (this.token.native) {
      await this.setAllFeeData();
      this.resetFee();
      this.balance = this.nativeBalance = Math.max(this.tokenDetail.balance - this.fee, 0);
      await this.checkEnoughBalance();
    } else {
      this.balance = this.tokenDetail.balance;
      this.nativeBalance = (await this.tokenDetailOf(this.blockchain.nativeToken())).balance;
    }
    this.addLowerThanValidator();
  }

  private addLowerThanValidator() {
    this.form.get('amount').addValidators(CustomValidators.lowerThanEqual(this.balance));
    this.form.get('amount').updateValueAndValidity();
  }

  private watchFormChanges() {
    this.form.valueChanges.subscribe(async () => {
      if (this.form.valid) {
        await this.setAllFeeData();
        await this.checkEnoughBalance();
      } else {
        this.resetFee();
      }
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
    return this._isSolana() ? await this._estimatedSolanaFee() : await this._estimatedFee();
  }

  private _isSolana(): boolean {
    return this.blockchain.name() === 'SOLANA';
  }

  private async _estimatedSolanaFee(): Promise<number> {
    return this.form.value.address
      ? await this.solanaFeeOf
          .create(
            new SolanaNativeSendTx(
              await this.walletsFactory.create().oneBy(this.blockchain),
              this.form.value.address,
              new WeiOf(this.form.value.amount, this.blockchain.nativeToken().json()).value().toNumber()
            ),
            this.blockchain
          )
          .value()
      : 0;
  }

  private async _estimatedFee(): Promise<number> {
    return this.token.native
      ? (await (await this.estimatedNativeGas()).value()).toNumber()
      : (await (await this.estimatedNonNativeGas()).value()).toNumber();
  }

  private async estimatedNativeGas(): Promise<Fee> {
    return new NativeGasOf(this.erc20Provider(), {
      to: await this.userWallet(),
      value: new WeiOf(this.form.value.amount || 1, this.token).value(),
    });
  }

  private async estimatedNonNativeGas(): Promise<Fee> {
    return new GasFeeOf((await this.erc20Contract()).value(), 'transfer', [
      this.form.value.address,
      new WeiOf(this.form.value.amount, this.token).value(),
    ]);
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
      network: this.blockchain.name(),
      currency: this.token,
      address: this.form.value.address,
      amount: this.form.value.amount,
      referenceAmount: this.form.value.quoteAmount,
      balanceNativeToken: this.nativeBalance,
      balance: this.balance,
      fee: this.fee.toString(),
      referenceFee: this.quoteFee.value.toString(),
      contact: this.contact ? this.contact.name : '',
    };
  }

  private getDynamicPriceOf(token: Coin | RawToken): Observable<number> {
    return this.dynamicPriceFactory
      .new(this.priceRefreshInterval, token, this.apiWalletService)
      .value()
      .pipe(takeUntil(this.destroy$));
  }

  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
    this.removeContact();
  }

  async checkEnoughBalance() {
    if (this.nativeBalance < this.fee) {
      await this.openModalBalance();
    }
  }

  async openModalBalance() {
    const modal = await this.modalController.create({
      component: BuyOrDepositTokenToastComponent,
      cssClass: 'ux-toast-warning-with-margin',
      showBackdrop: false,
      id: 'feeModal',
      componentProps: {
        text: 'defi_investments.confirmation.informative_modal_fee',
        primaryButtonText: 'defi_investments.confirmation.buy_button',
        secondaryButtonText: 'defi_investments.confirmation.deposit_button',
        token: this.nativeToken,
      },
    });
    if (window.location.href === this.modalHref) {
      await modal.present();
    }
    await modal.onDidDismiss();
  }

  navigateToContacts() {
    return this.navController.navigateForward(
      [
        `contacts/home/select/blockchain`,
        this.blockchain.name(),
        'token',
        this.token.contract,
        'amount',
        this.form.value.amount,
      ],
      { replaceUrl: true }
    );
  }

  removeContact() {
    this.contactDataService.updateContact(null);
  }
}
