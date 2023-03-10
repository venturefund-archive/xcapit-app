import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { TwoButtonsAlertComponent } from 'src/app/shared/components/two-buttons-alert/two-buttons-alert.component';
import { LanguageService } from '../../../shared/services/language/language.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RawBitrefillOperation } from '../shared-ramps/interfaces/raw-bitrefill-operation.interface';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Coin } from '../../wallets/shared-wallets/interfaces/coin.interface';
import { WalletPasswordComponent } from '../../wallets/shared-wallets/components/wallet-password/wallet-password.component';
import { Password } from '../../swaps/shared-swaps/models/password/password';
import { LoginToken } from '../../users/shared-users/models/login-token/login-token';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { WalletTransactionsService } from '../../wallets/shared-wallets/services/wallet-transactions/wallet-transactions.service';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { BitrefillOperation } from '../shared-ramps/models/bitrefill-operation/default-bitrefill-operation';
import { RawToken, TokenRepo } from '../../swaps/shared-swaps/models/token-repo/token-repo';
import { DefaultTokens } from '../../swaps/shared-swaps/models/tokens/tokens';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { BitrefillOperationFactory } from '../shared-ramps/models/bitrefill-operation/factory/bitrefill-operation.factory';
import { BuyOrDepositTokenToastComponent } from '../shared-ramps/components/buy-or-deposit-token-toast/buy-or-deposit-token-toast.component';
import { ActivatedRoute } from '@angular/router';
import { CovalentBalancesInjectable } from '../../wallets/shared-wallets/models/balances/covalent-balances/covalent-balances.injectable';
import { TokenDetail } from '../../wallets/shared-wallets/models/token-detail/token-detail';
import { Token } from '../../swaps/shared-swaps/models/token/token';
import { FixedTokens } from '../../swaps/shared-swaps/models/filtered-tokens/fixed-tokens';
import { TokenPricesInjectable } from '../../wallets/shared-wallets/models/prices/token-prices/token-prices.injectable';
import { TokenDetailInjectable } from '../../wallets/shared-wallets/models/token-detail/injectable/token-detail.injectable';
import { WalletsFactory } from '../../swaps/shared-swaps/models/wallets/factory/wallets.factory';
import { Wallet } from '../../swaps/shared-swaps/models/wallet/wallet';
import { Blockchain } from '../../swaps/shared-swaps/models/blockchain/blockchain';
import { BitrefillURL } from '../shared-ramps/models/bitrefill-url/bitrefill-url';
import { EnvService } from '../../../shared/services/env/env.service';

@Component({
  selector: 'app-bitrefill',
  template: `
    <ion-header class="b">
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar ux_toolbar__left">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="fiat-ramps/bitrefill/token-selection"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-start">
          {{ 'fiat_ramps.bitrefill.header' | translate }}
        </ion-title>
        <ion-buttons class="b__buttons" slot="end">
          <ion-button class="b__buttons__button" name="goBack" (click)="this.navigateBack()">
            <ion-text class="ux-font-header-titulo">{{ 'fiat_ramps.bitrefill.exit_button' | translate }} </ion-text>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <iframe
        *ngIf="this.url !== undefined"
        [src]="this.url"
        frameborder="0"
        scrolling="yes"
        width="100%"
        height="100%"
      ></iframe>
    </ion-content>
  `,
  styleUrls: ['./bitrefill.page.scss'],
})
export class BitrefillPage {
  url: SafeResourceUrl;
  operation: BitrefillOperation;
  rawOperationData: RawBitrefillOperation;
  availablePaymentMethods = ['usdc_polygon', 'ethereum', 'usdt_erc20', 'usdc_erc20'];
  modalHref: string;
  modalOpened: boolean;
  tplToken: RawToken;
  tplNativeToken: RawToken;
  balance: number;
  nativeBalance: number;
  tokenDetail: TokenDetail;
  nativeToken: Token;
  private wallet: Wallet;
  private blockchain: Blockchain;
  constructor(
    private translate: TranslateService,
    private modalController: ModalController,
    private navController: NavController,
    private languageService: LanguageService,
    private sanitizer: DomSanitizer,
    private apiWalletService: ApiWalletService,
    private storage: IonicStorageService,
    private walletTransactionsService: WalletTransactionsService,
    private toastService: ToastService,
    private trackService: TrackService,
    private blockchains: BlockchainsFactory,
    private bitrefillOperation: BitrefillOperationFactory,
    private route: ActivatedRoute,
    private platform: Platform,
    private tokenDetailInjectable: TokenDetailInjectable,
    private tokenPricesFactory: TokenPricesInjectable,
    private covalentBalancesFactory: CovalentBalancesInjectable,
    private walletsFactory: WalletsFactory,
    private envService: EnvService
  ) {}

  async ionViewWillEnter() {
    this.modalHref = window.location.href;
    this.setURL();
    this.addListener();
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navigateBack();
    });
  }

  async navigateBack() {
    if (!this.modalOpened) {
      const modal = await this.modalController.create({
        component: TwoButtonsAlertComponent,
        cssClass: 'modal',
        backdropDismiss: false,
        componentProps: {
          title: this.translate.instant('fiat_ramps.bitrefill.modal.title'),
          description: this.translate.instant('fiat_ramps.bitrefill.modal.description'),
          confirmButton: this.translate.instant('fiat_ramps.bitrefill.modal.confirm_button'),
          cancelButton: this.translate.instant('fiat_ramps.bitrefill.modal.cancel_button'),
        },
      });

      await modal.present();
      this.modalOpened = true;
      const { role } = await modal.onDidDismiss();
      this.modalOpened = false;
      if (role === 'confirm') {
        await this.navController.navigateBack('/tabs/wallets');
      }
    }
  }

  async setURL() {
    const paymentMethod = this.route.snapshot.paramMap.get('paymentMethod');
    const languageCode = await this.languageService.getSelectedLanguage();
    const affiliateCode = this.envService.byKey('bitrefillAffiliateCode');
    const rawBitrefillURL = new BitrefillURL(paymentMethod, languageCode, affiliateCode);
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(rawBitrefillURL.value());
  }

  addListener() {
    window.addEventListener('message', async (event) => await this.messageHandler(event), false);
  }

  async messageHandler(event) {
    this.rawOperationData = JSON.parse(event.data);
    if (this.rawOperationData.event === 'invoice_created') {
      this.operation = this.dataOf();
      this.tplToken = (await this.operation.token()).json();
      this.setBlockchain(this.tplToken.network);
      await this.setWallet();
      await this.setTokenDetail();
      await this.checksBeforeSendTx();
    } else if (this.rawOperationData.event === 'payment_intent') {
      await this.handleSubmit();
    }
  }

  dataOf(): BitrefillOperation {
    return this.bitrefillOperation.create(
      this.rawOperationData,
      new DefaultTokens(new TokenRepo(this.apiWalletService.getCoins())),
    );
  }

  async askForPassword() {
    const modal = await this.modalController.create({
      component: WalletPasswordComponent,
      cssClass: 'ux-routeroutlet-modal small-wallet-password-modal',
      componentProps: {
        state: 'send',
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    const password = new Password(data);
    if (await this.validPassword(password)) {
      return password;
    } else {
      await this.failedTransaction();
    }
  }

  async handleSubmit() {
    try {
      const password = await this.askForPassword();
      if (!password) {
        return;
      }
      await this.send(password.value());
    } catch (error) {
      this.failedTransaction();
    }
  }

  private async checksBeforeSendTx(): Promise<boolean> {
    if (!(await this.userCanAffordTx())) {
      await this.showInsufficientBalanceModal();
      return false;
    }
    if (!(await this.userCanAffordFees())) {
      this.showInsufficientBalanceFeeModal();
      return false;
    }
    return true;
  }

  private async setTokenDetail() {
    const token = await this.operation.token();
    this.nativeToken = this.blockchains.create().oneById(this.tplToken.chainId.toString()).nativeToken();
    this.tokenDetail = await this.tokenDetailOf(token);
    this.balance = this.tokenDetail.balance;
  }

  private async userCanAffordFees(): Promise<boolean> {
    return this.walletTransactionsService.canAffordSendFee(
      this.operation.address(),
      this.operation.amount(),
      (await this.operation.token()).json() as Coin
    );
  }

  private async userCanAffordTx(): Promise<boolean> {
    return this.balance >= this.operation.amount();
  }

  private async send(password: string) {
    const response = await this.walletTransactionsService.send(
      password,
      this.operation.amount(),
      this.operation.address(),
      (await this.operation.token()).json() as Coin
    );
    this.notifyWhenTransactionMined(response);
  }

  private notifyWhenTransactionMined(response?: TransactionResponse) {
    response
      .wait()
      .then(() => this.successTransaction())
      .catch(() => this.failedTransaction());
  }

  private async successTransaction() {
    await this.showSuccessToast();
    this.trackSuccessEvent();
  }

  private async failedTransaction() {
    await this.showErrorToast();
    this.trackErrorEvent();
  }

  private trackSuccessEvent() {
    this.trackService.trackEvent({
      eventLabel: 'ux_bitrefill_success',
    });
  }

  private trackErrorEvent() {
    this.trackService.trackEvent({
      eventLabel: 'ux_bitrefill_fail',
    });
  }

  private async showSuccessToast() {
    await this.toastService.showSuccessToast({
      message: this.translate.instant('fiat_ramps.bitrefill.toasts.success'),
    });
  }

  private async showErrorToast() {
    await this.toastService.showErrorToast({
      message: this.translate.instant('fiat_ramps.bitrefill.toasts.error'),
    });
  }

  showInsufficientBalanceFeeModal() {
    const text = 'swaps.home.balance_modal.insufficient_balance_fee.text';
    const primaryButtonText = 'swaps.home.balance_modal.insufficient_balance_fee.firstButtonName';
    const secondaryButtonText = 'swaps.home.balance_modal.insufficient_balance_fee.secondaryButtonName';
    this.openModalBalance(this.nativeToken, text, primaryButtonText, secondaryButtonText);
  }

  async showInsufficientBalanceModal() {
    const text = 'swaps.home.balance_modal.insufficient_balance.text';
    const primaryButtonText = 'swaps.home.balance_modal.insufficient_balance.firstButtonName';
    const secondaryButtonText = 'swaps.home.balance_modal.insufficient_balance.secondaryButtonName';
    this.openModalBalance(await this.operation.token(), text, primaryButtonText, secondaryButtonText);
  }

  async openModalBalance(token: Token, text: string, primaryButtonText: string, secondaryButtonText: string) {
    if (!this.modalOpened) {
      const modal = await this.modalController.create({
        component: BuyOrDepositTokenToastComponent,
        cssClass: 'ux-toast-warning',
        showBackdrop: false,
        id: 'feeModal',
        componentProps: { token, text, primaryButtonText, secondaryButtonText },
      });
      if (window.location.href === this.modalHref) {
        await modal.present();
        this.modalOpened = true;
      }
      await modal.onDidDismiss().then(() => (this.modalOpened = false));
    }
  }

  private async setWallet() {
    this.wallet = await this.walletsFactory.create().oneBy(this.blockchain);
  }

  private async tokenDetailOf(aToken: Token) {
    const tokenDetail = this.tokenDetailInjectable.create(
      this.covalentBalancesFactory.create(this.wallet.address(), new FixedTokens([aToken])),
      this.tokenPricesFactory.create(new FixedTokens([aToken])),
      aToken
    );
    await tokenDetail.cached();
    await tokenDetail.fetch();

    return tokenDetail;
  }

  private setBlockchain(aBlockchainName: string) {
    this.blockchain = this.blockchains.create().oneByName(aBlockchainName);
  }

  private validPassword(password: Password) {
    return new LoginToken(password, this.storage).valid();
  }

  ionViewWillLeave() {
    window.removeAllListeners();
  }
}
