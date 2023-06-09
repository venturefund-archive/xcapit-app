import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { WalletPasswordComponent } from '../../wallets/shared-wallets/components/wallet-password/wallet-password.component';
import { PROD_COINS } from '../../wallets/shared-wallets/constants/coins.prod';
import { Blockchain } from '../shared-swaps/models/blockchain/blockchain';
import { RawBlockchain } from '../shared-swaps/models/blockchain-repo/blockchain-repo';
import { JSONSwapInfo, NullJSONSwapInfo, RawSwapInfo } from '../shared-swaps/models/json-swap-info/json-swap-info';
import { Password } from '../shared-swaps/models/password/password';
import { Referral } from '../shared-swaps/models/referral/referral';
import { StandardizedTokens } from '../shared-swaps/models/standardized-tokens/standardized-tokens';
import { Swap } from '../shared-swaps/models/swap/swap';
import { SwapInfoOf } from '../shared-swaps/models/swap-info-of/swap-info-of';
import { Token } from '../shared-swaps/models/token/token';
import { TokenByAddress } from '../shared-swaps/models/token-by-address/token-by-address';
import { RawToken, TokenRepo } from '../shared-swaps/models/token-repo/token-repo';
import { Tokens } from '../shared-swaps/models/tokens/tokens';
import { Wallet } from '../shared-swaps/models/wallet/wallet';
import { Dex } from '../shared-swaps/models/dex';
import { SwapTransactions } from '../shared-swaps/models/swap-transactions/swap-transactions';
import { WalletsFactory } from '../shared-swaps/models/wallets/factory/wallets.factory';
import { BlockchainsFactory } from '../shared-swaps/models/blockchains/factory/blockchains.factory';
import { OneInchFactory } from '../shared-swaps/models/one-inch/factory/one-inch.factory';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { IntersectedTokensFactory } from '../shared-swaps/models/intersected-tokens/factory/intersected-tokens.factory';
import { SwapTransactionsFactory } from '../shared-swaps/models/swap-transactions/factory/swap-transactions.factory';
import { BlockchainTokens } from '../shared-swaps/models/blockchain-tokens/blockchain-tokens';
import { OneInchTokens } from '../shared-swaps/models/one-inch-tokens/one-inch-tokens';
import { LocalNotificationSchema } from '@capacitor/local-notifications';
import { LocalNotificationsService } from '../../notifications/shared-notifications/services/local-notifications/local-notifications.service';
import { AmountOf, NullAmountOf, RawAmount } from '../shared-swaps/models/amount-of/amount-of';
import { PasswordErrorHandlerService } from '../shared-swaps/services/password-error-handler/password-error-handler.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { GasStationOfFactory } from '../shared-swaps/models/gas-station-of/factory/gas-station-of.factory';
import { SwapInProgressModalComponent } from '../../wallets/shared-wallets/components/swap-in-progress-modal/swap-in-progress-modal.component';
import { PasswordErrorMsgs } from '../shared-swaps/models/password/password-error-msgs';
import { WalletBalanceService } from '../../wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Blockchains } from '../shared-swaps/models/blockchains/blockchains';
import { DefaultSwapsUrls } from '../shared-swaps/routes/default-swaps-urls';
import { OneInchBlockchainsOfFactory } from '../shared-swaps/models/one-inch-blockchains-of/factory/one-inch-blockchains-of';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { Observable, Subject } from 'rxjs';
import { DynamicPriceFactory } from 'src/app/shared/models/dynamic-price/factory/dynamic-price-factory';
import { LoginToken } from '../../users/shared-users/models/login-token/login-token';
import { BuyOrDepositTokenToastComponent } from '../../fiat-ramps/shared-ramps/components/buy-or-deposit-token-toast/buy-or-deposit-token-toast.component';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TxInProgressService } from '../shared-swaps/services/tx-in-progress/tx-in-progress.service';
import { SwapError } from '../shared-swaps/models/swap-error/swap-error';
import { TxInProgress } from '../../users/shared-users/models/tx-in-progress/tx-in-progress.interface';
import { SwapTxInProgress } from '../../users/shared-users/models/tx-in-progress/swap/swap-tx-in-progress';
import { BigNumber } from 'ethers';
import { WeiOf } from '../shared-swaps/models/wei-of/wei-of';
import BalanceModalInjectable from 'src/app/shared/models/balance-modal/injectable/balance-modal.injectable';

@Component({
  selector: 'app-swap-home',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_round_toolbar">
        <ion-buttons slot="start">
          <ion-back-button [defaultHref]="this.defaultNavBackUrl"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ 'swaps.home.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="content sw">
      <div class="sw__swap-card">
        <div class="sw__swap-card__networks ion-padding" *ngIf="this.tplBlockchain">
          <app-network-select-card
            appTrackClick
            name="ux_swap_matic"
            [dataToTrack]="{ eventLabel: this.blockchainName, description: this.url }"
            [title]="'wallets.send.send_detail.network_select.network' | translate"
            [networks]="this.tplAllowedBlockchainsName"
            [disclaimer]=""
            [selectedNetwork]="this.tplBlockchain.name"
            (networkChanged)="this.switchBlockchainTo($event)"
          ></app-network-select-card>
        </div>
        <hr />
        <div class="sw__swap-card__from ion-padding">
          <div class="sw__swap-card__from__title">
            <ion-text class="ux-font-text-lg">
              {{ 'swaps.home.from_token_title' | translate }}
            </ion-text>
          </div>
          <div class="sw__swap-card__from__detail">
            <div class="sw__swap-card__from__detail__token">
              <app-coin-selector
                *ngIf="this.tplFromToken"
                [selectedCoin]="this.tplFromToken"
                enabled="true"
                isRightOpen="true"
                (changeCurrency)="this.selectFromToken()"
              ></app-coin-selector>
            </div>
            <div class="sw__swap-card__from__detail__amount">
              <div class="sw__swap-card__from__detail__amount__USD-price">
                <ion-text class="ux-font-text-xxs" color="neutral80"
                  >= {{ this.fromTokenUSDAmount | formattedAmount : 10 : 2 }} USD</ion-text
                >
              </div>
              <form [formGroup]="this.form">
                <div class="sw__swap-card__from__detail__amount__wrapper">
                  <ion-input
                    appNumberInput
                    appCommaToDot
                    [disabled]="this.sameTokens || this.disableInput"
                    [ngClass]="{ insufficient: this.insufficientBalance }"
                    class="sw__swap-card__from__detail__amount__wrapper__input"
                    formControlName="fromTokenAmount"
                    type="text"
                    inputmode="decimal"
                  ></ion-input>
                  <ion-button
                    (click)="this.setMaxAmount()"
                    [disabled]="this.sameTokens || this.isMaxLoading"
                    slot="end"
                    fill="clear"
                    size="small"
                    class="sw__swap-card__from__detail__amount__wrapper__max ux-font-button"
                    >{{ 'defi_investments.shared.amount_input_card.max_button' | translate }}</ion-button
                  >
                </div>
              </form>
              <div
                *ngIf="!this.disableInput && (this.swapBalance || this.swapBalance === 0)"
                [ngClass]="
                  this.swapBalance === 0 || this.insufficientBalance
                    ? 'sw__swap-card__from__detail__insufficient'
                    : 'sw__swap-card__from__detail__available'
                "
              >
                <ion-text class="ux-font-text-xxs" color="neutral80">
                  {{ 'swaps.home.available' | translate }} {{ this.swapBalance | formattedAmount }}</ion-text
                >
              </div>
            </div>
          </div>
        </div>
        <div class="sw__swap-card__icon_area ion-padding-top">
          <hr />
          <div class="sw__swap-card__icon_area__content">
            <div class="sw__swap-card__icon_area__content__icon">
              <ion-icon icon="ux-arrow-narrow-down"></ion-icon>
            </div>
          </div>
          <hr />
        </div>
        <div class="sw__swap-card__to ion-padding-horizontal ion-padding-bottom">
          <div class="sw__swap-card__to__title">
            <ion-text class="ux-font-text-lg">
              {{ 'swaps.home.to_token_title' | translate }}
            </ion-text>
          </div>
          <div class="sw__swap-card__to__detail">
            <div class="sw__swap-card__to__detail__token">
              <app-coin-selector
                *ngIf="this.tplToToken"
                [selectedCoin]="this.tplToToken"
                enabled="true"
                isRightOpen="true"
                (changeCurrency)="this.selectToToken()"
              ></app-coin-selector>
            </div>
            <div class="sw__swap-card__to__detail__amount">
              <div class="sw__swap-card__to__detail__amount__value">
                <div class="sw__swap-card__to__detail__USD-price">
                  <ion-text class="ux-font-text-xxs" color="neutral80"
                    >= {{ this.toTokenUSDAmount | formattedAmount : 10 : 2 }} USD</ion-text
                  >
                </div>
                <ion-text class="ux-font-text-lg">
                  {{ this.tplSwapInfo.toTokenAmount | formattedAmount }}
                </ion-text>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div class="sw__swap-card__fee ion-padding-horizontal ion-padding-top">
          <div class="sw__swap-card__fee__title">
            <ion-text class="ux-font-header-titulo">
              {{ 'swaps.home.fee_title' | translate }}
            </ion-text>
          </div>
          <app-transaction-fee
            [balance]="this.feeBalance"
            [fee]="this.tplFee"
            [autoPrice]="true"
            [defaultFeeInfo]="true"
          ></app-transaction-fee>
        </div>
      </div>
      <div class="sw__checkbox ion-padding">
        <app-one-inch-tos-check disabled="true"> </app-one-inch-tos-check>
      </div>
    </ion-content>
    <ion-footer class="sw__footer">
      <div class="sw__footer__swap-button ion-padding">
        <ion-button
          [appLoading]="this.loadingBtn"
          [loadingText]="'swaps.home.loading_button_text' | translate"
          appTrackClick
          name="ux_swap_confirm"
          class="ux_button sw__footer__swap-button__button"
          color="secondary"
          [disabled]="this.form.invalid || this.disabledBtn"
          (click)="this.swapThem()"
          >{{ 'swaps.home.button' | translate }}</ion-button
        >
      </div>
      <div class="sw__footer__loader" *ngIf="this.loadingBtn">
        <span class="ux-font-text-xs text">
          {{ 'swaps.home.footer_text' | translate }}
        </span>
      </div>
    </ion-footer>
  `,
  styleUrls: ['./swap-home.page.scss'],
})
export class SwapHomePage {
  private activeBlockchain: Blockchain;
  private allowedBlockchains: Blockchains;
  private fromToken: Token;
  private toToken: Token;
  private tokens: Tokens;
  private dex: Dex;
  private swap: Swap;
  private referral: Referral = new Referral();
  private fromTokenKey = 'fromToken';
  private toTokenKey = 'toToken';
  private priceRefreshInterval = 15000;
  destroy$ = new Subject<void>();
  swapBalance: number;
  feeBalance = 0;
  loadingBtn: boolean;
  disabledBtn: boolean;
  tplBlockchain: RawBlockchain;
  tplAllowedBlockchainsName: string[];
  tplFromToken: RawToken;
  tplToToken: RawToken;
  tplFee: RawAmount = new NullAmountOf().json();
  tplSwapInfo: RawSwapInfo = new NullJSONSwapInfo().value();
  form: UntypedFormGroup = this.formBuilder.group({
    fromTokenAmount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
  });
  defaultNavBackUrl = 'tabs/wallets';
  swapInProgressUrl = 'swaps/swap-in-progress';
  actions = [];
  actionTypeId = 'SWAP';
  sameTokens = false;
  insufficientBalance: boolean;
  toTokenQuotePrice = 0;
  fromTokenQuotePrice = 0;
  fromTokenUSDAmount = 0;
  toTokenUSDAmount = 0;
  blockchainName: string;
  url: string;
  modalHref: string;
  modalOpened: boolean;
  txInProgress: TxInProgress;
  disableInput: boolean;
  fromTokenCoin: Coin;
  isMaxLoading = false;

  constructor(
    private apiWalletService: ApiWalletService,
    private walletBalance: WalletBalanceService,
    private route: ActivatedRoute,
    private navController: NavController,
    private formBuilder: UntypedFormBuilder,
    private modalController: ModalController,
    private appStorageService: AppStorageService,
    private wallets: WalletsFactory,
    private blockchains: BlockchainsFactory,
    private oneInch: OneInchFactory,
    private intersectedTokens: IntersectedTokensFactory,
    private swapTransactions: SwapTransactionsFactory,
    private localNotificationsService: LocalNotificationsService,
    private gasStation: GasStationOfFactory,
    private trackService: TrackService,
    private passwordErrorHandlerService: PasswordErrorHandlerService,
    private toastService: ToastService,
    private translate: TranslateService,
    private oneInchBlockchainsOf: OneInchBlockchainsOfFactory,
    private dynamicPriceFactory: DynamicPriceFactory,
    private storage: IonicStorageService,
    private swapInProgressService: TxInProgressService,
    private balanceModalInjectable: BalanceModalInjectable
  ) {}

  private async setSwapInfo(fromTokenAmount: string) {
    if (fromTokenAmount) {
      this.swap = new Swap(fromTokenAmount, this.fromToken, this.toToken);
    }
    this.tplSwapInfo = await this.jsonSwapInfo(fromTokenAmount);
  }

  private async setFeeInfo() {
    const originalFee = (await this.gasPrice()).times(this.tplSwapInfo.estimatedGas);
    if (this._isNativeToken()) {
      const weiAmount = BigNumber.from(originalFee.weiValue());
      this.tplFee = new AmountOf(weiAmount.mul(13).div(10).toString(), this.fromToken).json();
    } else {
      this.tplFee = originalFee.json();
    }
  }

  private setNullFeeInfo() {
    this.tplFee = new NullAmountOf().json();
  }

  private gasPrice(): Promise<AmountOf> {
    return this.gasStation.create(this.activeBlockchain).price().fast();
  }

  private async jsonSwapInfo(fromTokenAmount: string): Promise<RawSwapInfo> {
    return fromTokenAmount
      ? await new JSONSwapInfo(new SwapInfoOf(this.swap, this.dex, this.referral)).value()
      : new NullJSONSwapInfo().value();
  }

  async ionViewDidEnter() {
    this.modalHref = window.location.href;
    this.trackPage();
    this.setAllowedBlockchains();
    this.setBlockchain(this.route.snapshot.paramMap.get('blockchain'));
    this.setNullFeeInfo();
    this.setDex();
    this.setTokens();
    await this.setTokensToSwap(
      this.route.snapshot.paramMap.get(this.fromTokenKey),
      this.route.snapshot.paramMap.get(this.toTokenKey)
    );
    this.setTokenAmount();
    this.subscribeToFromTokenAmountChanges();
    this.setFeeInfo();
    this.setQuotePrices();
  }

  setAllowedBlockchains() {
    this.allowedBlockchains = this.oneInchBlockchainsOf.create(this.blockchains.create());
    this.tplAllowedBlockchainsName = this.allowedBlockchains.value().map((blockchain) => blockchain.name());
  }

  private async setTokenAmount() {
    this.disableInput = true;
    await this.balanceAvailableOf(this.fromToken.symbol(), this.activeBlockchain.name());
    this.disableInput = false;
    const value = this.route.snapshot.queryParamMap.get('from-token-amount');
    if (value) {
      this.form.patchValue({ fromTokenAmount: value });
      this.checkBalance(value);
    }
  }

  private setQuotePrices() {
    this.setToTokenQuotePrice();
    this.setFromTokenQuotePrice();
  }

  private setToTokenQuotePrice(): void {
    this.getDynamicPriceOf(this.toToken.json()).subscribe((price: number) => {
      this.toTokenQuotePrice = price;
      this.setUSDPrices(this.form.get('fromTokenAmount').value);
    });
  }

  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setFromTokenQuotePrice(): void {
    this.getDynamicPriceOf(this.fromToken.json()).subscribe((price: number) => {
      this.fromTokenQuotePrice = price;
      this.setUSDPrices(this.form.get('fromTokenAmount').value);
    });
  }

  private getDynamicPriceOf(token: Coin | RawToken): Observable<number> {
    return this.dynamicPriceFactory
      .new(this.priceRefreshInterval, token, this.apiWalletService)
      .value()
      .pipe(takeUntil(this.destroy$));
  }

  switchBlockchainTo(aBlockchainName: string) {
    this.navController.navigateForward(new DefaultSwapsUrls().homeByBlockchain(aBlockchainName), {
      replaceUrl: true,
      animated: false,
    });
  }

  async balanceAvailableOf(aCoin: string, aNetwork: string) {
    const aToken = this.apiWalletService.getCoin(aCoin, aNetwork);
    this.swapBalance = await this.walletBalance.balanceOf(aToken);
    if (aToken.native) {
      this.feeBalance = this.tplFee.value;
    } else {
      const aNativeToken = this.apiWalletService.getNativeTokenFromNetwork(aToken.network);
      this.feeBalance = await this.walletBalance.balanceOf(aNativeToken);
    }
  }

  private subscribeToFromTokenAmountChanges() {
    this.form
      .get('fromTokenAmount')
      .valueChanges.pipe(debounceTime(500))
      .subscribe(async (value) => {
        this.checkBalance(value);
        if (value > this.swapBalance) {
          this.showInsufficientBalanceModal();
          this.disableMainButton();
        }
        await this.setFeeAndSwapInfo(value);
        await this.recalculateQuoteAndBalance(value);
      });
  }

  private setUSDPrices(value) {
    this.fromTokenUSDAmount = value * this.fromTokenQuotePrice;
    this.toTokenUSDAmount = this.tplSwapInfo.toTokenAmount * this.toTokenQuotePrice;
  }

  private trackPage() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: '/swaps/home',
      eventLabel: 'ux_swaps_screenview_home',
    });
  }

  private resetMainButton() {
    this.loadingBtn = false;
    this.disabledBtn = false;
  }

  selectFromToken() {
    this.changeCurrency(this.fromTokenKey);
  }

  selectToToken() {
    this.changeCurrency(this.toTokenKey);
  }

  private changeCurrency(tokenToSelect: string) {
    this.navController.navigateForward([
      'swaps/select-currency/blockchain',
      this.activeBlockchain.name(),
      'from-token',
      this.fromToken.address(),
      'to-token',
      this.toToken.address(),
      'token-to-select',
      tokenToSelect,
      'from-token-amount',
      this.form.value.fromTokenAmount,
    ]);
  }

  private async setTokensToSwap(fromTokenAddress: string, toTokenAddress: string) {
    this.fromToken = await new TokenByAddress(fromTokenAddress, this.tokens).value();

    this.tplFromToken = this.fromToken.json();
    this.toToken = await new TokenByAddress(toTokenAddress, this.tokens).value();
    this.tplToToken = this.toToken.json();
    this.checkTokens();
  }

  private async checkTokens() {
    if (this.fromToken.address() === this.toToken.address()) {
      await this.toastService.showWarningToast({
        message: this.translate.instant('swaps.home.warning_same_tokens'),
      });
      this.sameTokens = true;
    } else {
      this.sameTokens = false;
    }
  }

  private setDex() {
    this.dex = this.oneInch.create(this.activeBlockchain);
  }

  private setTokens() {
    this.tokens = this.intersectedTokens.create(this.blockchainTokens(), new OneInchTokens(this.dex));
  }

  private blockchainTokens(): BlockchainTokens {
    return new BlockchainTokens(this.activeBlockchain, new StandardizedTokens(new TokenRepo(PROD_COINS)));
  }

  private setBlockchain(aBlockchainName: string) {
    this.activeBlockchain = this.blockchains.create().oneByName(aBlockchainName);
    this.tplBlockchain = this.activeBlockchain.json();
    this.trackClickEventName(aBlockchainName);
  }

  async requestPassword() {
    const modal = await this.modalController.create({
      component: WalletPasswordComponent,
      cssClass: 'ux-routeroutlet-modal small-wallet-password-modal',
      componentProps: {
        state: 'swap',
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.setMainButtonToLoading();
    const password = new Password(data);
    if (await this.validPassword(password)) {
      this.showSwapInProgressModal();
      this.txInProgress = new SwapTxInProgress(this.activeBlockchain);
      this.swapInProgressService.startTx(this.txInProgress);
    } else {
      throw new Error(new PasswordErrorMsgs().invalid());
    }
    return password.value();
  }

  private validPassword(password: Password) {
    return new LoginToken(password, this.storage).valid();
  }

  private setMainButtonToLoading() {
    this.loadingBtn = true;
  }

  private disableMainButton() {
    this.disabledBtn = true;
  }

  private enabledMainButton() {
    this.disabledBtn = false;
  }

  async swapThem() {
    this.disableMainButton();
    const wallet = await this.wallets.create(this.appStorageService).oneBy(this.activeBlockchain);
    wallet.onNeedPass().subscribe(() => this.requestPassword());
    wallet
      .sendTxs(await this.swapTxs(wallet).blockchainTxs())
      .then(() => this.notifyWhenSwap(this.createNotification('swap_ok')))
      .catch((err: Error) => {
        this.handleError(err);
        this.resetMainButton();
      })
      .finally(() => {
        this.swapInProgressService.finishTx(this.txInProgress);
      });
  }

  private handleError(err: Error) {
    this.passwordErrorHandlerService.handlePasswordError(err, () => {
      this.showPasswordError();
    });
    if (!new PasswordErrorMsgs().isAPassError(err)) {
      this.notifyWhenSwap(this.createNotification(new SwapError(err).type()));
    }
  }

  private async showPasswordError() {
    await this.toastService.showErrorToast({ message: this.translate.instant('swaps.errors.invalid_password') });
  }

  private swapTxs(wallet: Wallet): SwapTransactions {
    return this.swapTransactions.create(this.swap, wallet, this.dex);
  }

  private notifyWhenSwap(notification: LocalNotificationSchema[]) {
    this.localNotificationsService.registerActionTypes(this.actionTypeId, this.actions);
    this.localNotificationsService.addListener(() => {
      this.navigateToTokenDetail();
    });
    this.localNotificationsService.send(notification);
  }

  private navigateToTokenDetail() {
    this.navController.navigateForward([
      'wallets/token-detail/blockchain',
      this.activeBlockchain.name(),
      'token',
      this.toToken.address(),
    ]);
  }

  private createNotification(mode: string): LocalNotificationSchema[] {
    return [
      {
        id: 1,
        title: this.translate.instant(`swaps.sent_notification.${mode}.title`),
        body: this.translate.instant(`swaps.sent_notification.${mode}.body`, this.notificationBody(mode)),
        actionTypeId: this.actionTypeId,
      },
    ];
  }

  private notificationBody(mode: string) {
    let result = {};
    if (mode !== 'swap_not_ok_blockchain') {
      result = {
        fromAmount: this.form.get('fromTokenAmount').value,
        fromToken: this.swap.fromToken().symbol(),
        toAmount: this.parseAmount(this.tplSwapInfo.toTokenAmount),
        toToken: this.swap.toToken().symbol(),
      };
    }
    return result;
  }

  private parseAmount(value: number): string {
    let stringValue = value.toString();
    if (stringValue.includes('e')) {
      stringValue = parseFloat(stringValue).toFixed(8);
    }
    return stringValue;
  }

  async showSwapInProgressModal() {
    const modal = await this.modalController.create({
      component: SwapInProgressModalComponent,
      componentProps: {},
      cssClass: 'ux-lg-modal-informative',
      backdropDismiss: false,
    });
    await modal.present();
  }

  async setMaxAmount() {
    this.isMaxLoading = true;
    if (this._isNativeToken()) await this.setFeeAndSwapInfo(this.swapBalance.toString());
    const maxValue = this._maxAmount();
    this.form.patchValue({ fromTokenAmount: maxValue }, { emitEvent: false, onlySelf: true });
    await this.recalculateQuoteAndBalance(maxValue);
    this.form.updateValueAndValidity();
    this.swapBalance = this._maxAmount();
    this.checkBalance(maxValue);
    this.isMaxLoading = false;
  }

  async setFeeAndSwapInfo(value: string) {
    this.setNullFeeInfo();
    await this.setSwapInfo(value);
    await this.setFeeInfo();
  }

  async recalculateQuoteAndBalance(value: number) {
    await this.balanceAvailableOf(this.fromToken.symbol(), this.activeBlockchain.name());
    this.setUSDPrices(value);
    this.checkFee(value);
  }

  private _maxAmount() {
    return this._isNativeToken() ? Math.max(this.swapBalance - this.tplFee.value, 0) : this.swapBalance;
  }

  private _isNativeToken() {
    return this.fromToken.symbol() === this.activeBlockchain.nativeToken().symbol();
  }

  checkBalance(value) {
    if (value > this.swapBalance) {
      this.insufficientBalance = true;
    } else {
      this.insufficientBalance = false;
    }
  }

  checkFee(value: number) {
    if (value <= this.swapBalance) {
      if (this.fromToken.json().native) {
        const weiValue = new WeiOf(value, this.fromToken).value();
        const weiFee = new WeiOf(this.tplFee.value, this.fromToken).value();
        const feePlusValueResult = new AmountOf(weiValue.add(weiFee).toString(), this.fromToken).value();
        if (feePlusValueResult > this.swapBalance) {
          this.showInsufficientBalanceFeeModal();
        } else {
          this.enabledMainButton();
        }
      } else {
        if (this.tplFee.value > this.feeBalance) {
          this.showInsufficientBalanceFeeModal();
        } else {
          this.enabledMainButton();
        }
      }
    }
  }

  trackClickEventName(blockchain: string) {
    this.blockchainName = `ux_swap_${blockchain.toLowerCase()}`;
    this.url = `/swaps/home/blockchain/${blockchain}`;
  }

  showInsufficientBalanceFeeModal() {
    this.openModalBalance(
      this.activeBlockchain.nativeToken(),
      'swaps.home.balance_modal.insufficient_balance_fee.text',
      'swaps.home.balance_modal.insufficient_balance_fee.firstButtonName',
      'swaps.home.balance_modal.insufficient_balance_fee.secondaryButtonName'
    );
  }

  showInsufficientBalanceModal() {
    this.openModalBalance(
      this.fromToken,
      'swaps.home.balance_modal.insufficient_balance.text',
      'swaps.home.balance_modal.insufficient_balance.firstButtonName',
      'swaps.home.balance_modal.insufficient_balance.secondaryButtonName'
    );
  }

  async openModalBalance(token: Token, description: string, primaryButtonText: string, secondaryButtonText: string) {
    if (!this.modalOpened && window.location.href === this.modalHref) {
      this.modalOpened = true;
      const modal = this.balanceModalInjectable.create(token, description, primaryButtonText, secondaryButtonText);
      await modal.show();
      modal.onDidDismiss().then(() => (this.modalOpened = false));
    }
  }
}
