import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { debounceTime } from 'rxjs/operators';
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
import { SwapTransactions } from '../shared-swaps/models/swap-transactions/swpa-transactions';
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
            [title]="'wallets.send.send_detail.network_select.network' | translate"
            [networks]="[this.tplBlockchain.name]"
            [disclaimer]=""
            [selectedNetwork]="this.tplBlockchain.name"
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
                (changeCurrency)="this.selectFromToken()"
              ></app-coin-selector>
            </div>
            <div class="sw__swap-card__from__detail__amount">
              <form [formGroup]="this.form">
                <ion-input
                  class="sw__swap-card__from__detail__amount__input"
                  formControlName="fromTokenAmount"
                  type="number"
                  inputmode="decimal"
                ></ion-input>
              </form>
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
                (changeCurrency)="this.selectToToken()"
              ></app-coin-selector>
            </div>
            <div class="sw__swap-card__to__detail__amount">
              <div class="sw__swap-card__to__detail__amount__value">
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
          <app-transaction-fee [fee]="this.tplFee" [autoPrice]="true" [defaultFeeInfo]="true"></app-transaction-fee>
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
          name="ux_swaps_swap"
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
  private fromToken: Token;
  private toToken: Token;
  private tokens: Tokens;
  private dex: Dex;
  private swap: Swap;
  private referral: Referral = new Referral();
  private fromTokenKey = 'fromToken';
  private toTokenKey = 'toToken';
  loadingBtn: boolean;
  disabledBtn: boolean;
  tplBlockchain: RawBlockchain;
  tplFromToken: RawToken;
  tplToToken: RawToken;
  tplFee: RawAmount = new NullAmountOf().json();
  tplSwapInfo: RawSwapInfo = new NullJSONSwapInfo().value();
  form: UntypedFormGroup = this.formBuilder.group({
    fromTokenAmount: ['0', [Validators.required, CustomValidators.greaterThan(0)]],
  });
  defaultNavBackUrl = 'tabs/wallets';
  swapInProgressUrl = 'swaps/swap-in-progress';
  actions = [];
  actionTypeId = 'SWAP';

  constructor(
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
    private translate: TranslateService
  ) {}

  private async setSwapInfo(fromTokenAmount: string) {
    if (fromTokenAmount) {
      this.swap = new Swap(fromTokenAmount, this.fromToken, this.toToken);
    }
    this.tplSwapInfo = await this.jsonSwapInfo(fromTokenAmount);
  }

  private async setFeeInfo() {
    this.tplFee = (await this.gasPrice()).times(this.tplSwapInfo.estimatedGas).json();
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
    this.trackPage();
    this.subscribeToFromTokenAmountChanges();
    this.setBlockchain(this.route.snapshot.paramMap.get('blockchain'));
    this.setNullFeeInfo();
    this.setDex();
    this.setTokens();
    this.setFeeInfo();
    await this.setTokensToSwap(
      this.route.snapshot.paramMap.get(this.fromTokenKey),
      this.route.snapshot.paramMap.get(this.toTokenKey)
    );
  }

  private subscribeToFromTokenAmountChanges() {
    this.form
      .get('fromTokenAmount')
      .valueChanges.pipe(debounceTime(500))
      .subscribe(async (value) => {
        this.setNullFeeInfo();
        await this.setSwapInfo(value);
        this.setFeeInfo();
      });
  }

  private trackPage() {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
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
    ]);
  }

  private async setTokensToSwap(fromTokenAddress: string, toTokenAddress: string) {
    this.fromToken = await new TokenByAddress(fromTokenAddress, this.tokens).value();
    this.tplFromToken = this.fromToken.json();
    this.toToken = await new TokenByAddress(toTokenAddress, this.tokens).value();
    this.tplToToken = this.toToken.json();
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
    return new Password(data).value();
  }

  private setMainButtonToLoading() {
    this.loadingBtn = true;
  }

  private disableMainButton() {
    this.disabledBtn = true;
  }

  async swapThem() {
    this.disableMainButton();
    const wallet = await this.wallets.create(this.appStorageService).oneBy(this.activeBlockchain);
    wallet.onNeedPass().subscribe(() => this.requestPassword());
    wallet.onDecryptedWallet().subscribe(() => this.showSwapInProgressModal());
    wallet
      .sendTxs(await this.swapTxs(wallet).blockchainTxs())
      .then(() => {
        this.notifyWhenSwap(this.createNotification('swap_ok'));
      })
      .catch((err: Error) => {
        this.handleError(err);
        this.resetMainButton();
      });
  }

  private handleError(err: Error) {
    this.passwordErrorHandlerService.handlePasswordError(err, () => {
      this.showPasswordError();
    });
    if (!new PasswordErrorMsgs().isAPassError(err)) {
      this.notifyWhenSwap(this.createNotification('swap_not_ok'));
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
    this.navController.navigateForward([this.defaultNavBackUrl]);
  }

  private createNotification(mode: string): LocalNotificationSchema[] {
    return [
      {
        id: 1,
        title: this.translate.instant(`swaps.sent_notification.${mode}.title`),
        body: this.translate.instant(`swaps.sent_notification.${mode}.body`, {
          fromAmount: this.form.get('fromTokenAmount').value,
          fromToken: this.swap.fromToken().symbol(),
          toAmount: this.tplSwapInfo.toTokenAmount,
          toToken: this.swap.toToken().symbol(),
        }),
        actionTypeId: this.actionTypeId,
      },
    ];
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
}
