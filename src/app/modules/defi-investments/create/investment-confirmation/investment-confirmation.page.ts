import { IonicStorageService } from './../../../../shared/services/ionic-storage/ionic-storage.service';
import { LINKS } from 'src/app/config/static-links';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import {
  Investment,
  TwoPiInvestment,
} from '../../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { InvestmentProduct } from '../../shared-defi-investments/interfaces/investment-product.interface';
import { TranslateService } from '@ngx-translate/core';
import { WalletPasswordComponent } from '../../../wallets/shared-wallets/components/wallet-password/wallet-password.component';
import { ModalController, NavController } from '@ionic/angular';
import { WalletService } from '../../../wallets/shared-wallets/services/wallet/wallet.service';
import { Component } from '@angular/core';
import { InvestmentDataService } from '../../shared-defi-investments/services/investment-data/investment-data.service';
import { Amount } from '../../shared-defi-investments/types/amount.type';
import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { BigNumber, VoidSigner, Wallet } from 'ethers';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { ApiWalletService } from '../../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Subject } from 'rxjs';
import { DynamicPrice } from '../../../../shared/models/dynamic-price/dynamic-price.model';
import { takeUntil } from 'rxjs/operators';
import { ERC20Contract } from '../../shared-defi-investments/models/erc20-contract/erc20-contract.model';
import { DefaultERC20Provider } from '../../shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { FakeContract } from '../../shared-defi-investments/models/fake-contract/fake-contract.model';
import { Coin } from '../../../wallets/shared-wallets/interfaces/coin.interface';
import { GasFeeOf } from '../../../../shared/models/gas-fee-of/gas-fee-of.model';
import { TotalFeeOf } from '../../shared-defi-investments/models/total-fee-of/total-fee-of.model';
import { Fee } from '../../shared-defi-investments/interfaces/fee.interface';
import { WalletBalanceService } from 'src/app/modules/wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { ActivatedRoute } from '@angular/router';
import { WeiOf } from 'src/app/shared/models/wei-of/wei-of';
import { BuyOrDepositTokenToastComponent } from 'src/app/modules/fiat-ramps/shared-ramps/components/buy-or-deposit-token-toast/buy-or-deposit-token-toast.component';
import { GasStationOfFactory } from 'src/app/modules/swaps/shared-swaps/models/gas-station-of/factory/gas-station-of.factory';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { InProgressTransactionModalComponent } from 'src/app/shared/components/in-progress-transaction-modal/in-progress-transaction-modal.component';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { format } from 'date-fns';
import { LocalNotification } from 'src/app/shared/models/local-notification/local-notification.interface';
import { LocalNotificationInjectable } from 'src/app/shared/models/local-notification/injectable/local-notification.injectable';
import { DefiInvestmentsService } from '../../shared-defi-investments/services/defi-investments-service/defi-investments.service';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { AmountOf } from 'src/app/modules/wallets/shared-wallets/models/blockchain-tx/amount-of/amount-of';

@Component({
  selector: 'app-investment-confirmation',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ this.headerText | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ic" *ngIf="this.product">
      <ion-card class="ux-card no-border">
        <app-expandable-investment-info
          fbPrefix="ux_invest"
          [investmentProduct]="this.product"
        ></app-expandable-investment-info>
        <div class="summary">
          <div class="summary__amount">
            <div class="summary__amount__label">
              <ion-text class="ux-font-titulo-xs">{{ this.labelText | translate }}</ion-text>
            </div>

            <div class="summary__amount__qty">
              <ion-text class="ux-font-text-base summary__amount__qty__amount"
                >{{ this.amount.value | formattedAmount }} {{ this.amount.token }}</ion-text
              >
              <ion-text class="ux-font-text-base summary__amount__qty__quoteAmount"
                >{{ this.quoteAmount.value | formattedAmount : 10 : 2 }} {{ this.quoteAmount.token }}
              </ion-text>
            </div>
          </div>
          <app-transaction-fee
            [fee]="this.fee"
            [quoteFee]="this.quoteFee"
            [balance]="this.nativeTokenBalance"
            [showErrors]="!this.isElegibleToFund"
          >
          </app-transaction-fee>
        </div>
      </ion-card>
      <form [formGroup]="this.form" class="ion-padding-horizontal ion-padding-bottom">
        <ion-item *ngIf="!this.agreement" class="term-item ion-no-padding ion-no-margin">
          <ion-checkbox
            appTrackClick
            formControlName="thirdPartyDisclaimer"
            mode="md"
            slot="start"
            name="ux_invest_disclaimer_check_button_0"
          ></ion-checkbox>
          <ion-label class="ion-no-padding ion-no-margin">
            <ion-text class="ux-font-text-xxs" color="neutral80">
              {{ 'defi_investments.confirmation.terms.third_party_disclaimer' | translate }}
            </ion-text>
          </ion-label>
        </ion-item>

        <ion-item *ngIf="!this.agreement" class="term-item ion-no-padding ion-no-margin">
          <ion-checkbox
            appTrackClick
            formControlName="termsAndConditions"
            mode="md"
            slot="start"
            name="ux_invest_disclaimer_check_button_1"
          ></ion-checkbox>
          <ion-label class="ion-no-padding ion-no-margin checkbox-link">
            <ion-text class="ux-font-text-xxs" color="neutral80">{{
              'defi_investments.confirmation.terms.i_have_read' | translate
            }}</ion-text>
            <ion-text class="ux-link-xs" (click)="this.openTOS()">{{
              'defi_investments.confirmation.terms.link_to_terms' | translate
            }}</ion-text>
          </ion-label>
        </ion-item>
        <ion-item *ngIf="this.agreement" class="term-item ion-no-padding ion-no-margin">
          <ion-label class="ion-no-padding ion-no-margin">
            <ion-text name="ux_tyc_accepted" class="ux-font-text-xxs" color="neutral80">{{
              'defi_investments.confirmation.terms.you_have_accepted' | translate
            }}</ion-text>
            <ion-text class="ux-link-xs" (click)="this.openTOS()">{{
              'defi_investments.confirmation.terms.link_to_terms' | translate
            }}</ion-text>
          </ion-label>
        </ion-item>
      </form>

      <ion-button
        [appLoading]="this.loading"
        [loadingText]="'defi_investments.confirmation.submit_loading' | translate"
        appTrackClick
        name="ux_invest_confirm"
        expand="block"
        size="large"
        type="submit"
        class="ion-padding-start ion-padding-end ux_button"
        color="secondary"
        (click)="this.invest()"
        [disabled]="!this.form.valid || this.disable"
      >
        {{ 'defi_investments.confirmation.submit' | translate }}
      </ion-button>
    </ion-content>
  `,
  styleUrls: ['./investment-confirmation.page.scss'],
})
export class InvestmentConfirmationPage {
  form = this.formBuilder.group({
    thirdPartyDisclaimer: [false, Validators.requiredTrue],
    termsAndConditions: [false, Validators.requiredTrue],
  });
  product: InvestmentProduct;
  agreement: boolean;
  token: Coin;
  available: number;
  nativeToken: Coin;
  nativeTokenBalance: number;
  amount: Amount;
  quoteAmount: Amount;
  isElegibleToFund: boolean;
  isFeatureFlagFaucet: boolean;
  fee: Amount = { value: undefined, token: 'MATIC' };
  quoteFee: Amount = { value: undefined, token: 'USD' };
  loading = false;
  leave$ = new Subject<void>();
  disable = true;
  private readonly priceRefreshInterval = 15000;
  links = LINKS;
  mode: string;
  headerText: string;
  labelText: string;
  isNegativeBalance: boolean;
  modalHref: string;
  notification: LocalNotification;
  constructor(
    private investmentDataService: InvestmentDataService,
    private walletService: WalletService,
    private modalController: ModalController,
    private translate: TranslateService,
    private walletEncryptionService: WalletEncryptionService,
    private toastService: ToastService,
    private apiWalletService: ApiWalletService,
    private walletBalance: WalletBalanceService,
    private formBuilder: UntypedFormBuilder,
    private browserService: BrowserService,
    private storage: IonicStorageService,
    private route: ActivatedRoute,
    private localNotificationInjectable: LocalNotificationInjectable,
    private gasStation: GasStationOfFactory,
    private blockchains: BlockchainsFactory,
    private navController: NavController,
    private defiInvesmentService: DefiInvestmentsService,
    private remoteConfig: RemoteConfigService,
    private trackService: TrackService
  ) {}

  async ionViewDidEnter() {
    this.modalHref = window.location.href;
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.checkFeatureFlagFaucet();
    this.checkTwoPiAgreement();
    this.updateTexts();
    await this.setInvestmentInfo();
    this.dynamicPrice();
    await this.walletService.walletExist();
    await this.getNativeTokenBalance();
    this.setIsElegibleToFund();
    await this.checkNativeTokenBalance();
  }

  private dynamicPrice() {
    this.createDynamicPrice()
      .value()
      .pipe(takeUntil(this.leave$))
      .subscribe((price: number) => {
        this.quoteFee.value = price * this.fee.value;
      });
  }

  createDynamicPrice(): DynamicPrice {
    return DynamicPrice.create(this.priceRefreshInterval, this.native(), this.apiWalletService);
  }

  private async setInvestmentInfo() {
    this.setProduct();
    this.setProductToken();
    this.setAmount();
    this.setQuoteAmount();
    await this.setFee();
  }

  private setProduct() {
    this.product = this.investmentDataService.product;
  }

  private setAmount() {
    this.amount = {
      value: this.investmentDataService.amount,
      token: this.investmentDataService.product.token().value,
    };
  }

  private setQuoteAmount(): void {
    this.quoteAmount = { value: this.investmentDataService.quoteAmount, token: 'USD' };
  }

  createErc20Provider() {
    return new DefaultERC20Provider(this.product.token());
  }

  async approveFeeContract(): Promise<ERC20Contract> {
    return new ERC20Contract(
      this.createErc20Provider(),
      new VoidSigner((await this.walletEncryptionService.getEncryptedWallet()).addresses[this.product.token().network])
    );
  }

  private native(): Coin {
    return this.apiWalletService.getCoinsFromNetwork(this.product.token().network).find((coin) => coin.native);
  }

  private async approvalFee(): Promise<Fee> {
    return new GasFeeOf((await this.approveFeeContract()).value(), 'approve', [
      this.product.contractAddress(),
      new WeiOf(this.investmentDataService.amount, this.product.token()).value(),
    ]);
  }

  private async depositFee(): Promise<Fee> {
    return new GasFeeOf(new FakeContract({ deposit: () => BigNumber.from('1993286') }), 'deposit', []);
  }

  private async setFee() {
    this.fee = (await this._gasPrice()).times(await this._investmentEstimatedGas()).json();
  }

  private async _investmentEstimatedGas(): Promise<number> {
    return (await new TotalFeeOf([await this.approvalFee(), await this.depositFee()]).value()).toNumber();
  }

  private async _gasPrice(): Promise<AmountOf> {
    return await this.gasStation.create(this.blockchains.create().oneByName(this.token.network)).price().standard();
  }

  async requestPassword(): Promise<any> {
    const modal = await this.modalController.create({
      component: WalletPasswordComponent,
      componentProps: {
        title: this.translate.instant('defi_investments.confirmation.password_modal.title'),
        description: this.translate.instant('defi_investments.confirmation.password_modal.description'),
        inputLabel: this.translate.instant('defi_investments.confirmation.password_modal.input_label'),
        submitButtonText: this.translate.instant('defi_investments.confirmation.password_modal.confirm_button'),
        disclaimer: '',
        state: 'invest',
      },
      cssClass: 'ux-routeroutlet-modal small-wallet-password-modal',
      backdropDismiss: false,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (!data) {
      this.disable = false;
    } else {
      return data;
    }
  }

  investment(wallet: Wallet): Investment {
    return TwoPiInvestment.create(this.product, wallet, this.apiWalletService);
  }

  async decryptedWallet(password: string): Promise<Wallet> {
    try {
      return await this.walletEncryptionService.getDecryptedWalletForCurrency(password, this.product.token());
    } catch {
      this.loadingEnabled(false);
      await this.toastService.showErrorToast({
        message: this.translate.instant('defi_investments.confirmation.password_error'),
      });
      this.disable = false;
    }
  }

  async wallet(): Promise<Wallet | void> {
    const password = await this.requestPassword();
    if (password) {
      this.loadingEnabled(true);
      return await this.decryptedWallet(password);
    }
  }

  private setProductToken() {
    this.token = this.product.token();
  }

  async getTokenBalanceAvailable() {
    return (this.available = await this.walletBalance.balanceOf(this.token));
  }

  checkTokenBalance() {
    return this.available >= this.amount.value ? true : false;
  }

  openModalTokenBalance() {
    this.toastService.showWarningToast({
      message: this.translate.instant(
        this.translate.instant('defi_investments.confirmation.informative_modal', { token: this.token.value })
      ),
    });
  }
  async getNativeTokenBalance() {
    this.nativeToken = this.apiWalletService
      .getCoins()
      .find((coin) => coin.native && coin.network === this.token.network);
    this.nativeTokenBalance = await this.walletBalance.balanceOf(this.nativeToken);
    return this.nativeTokenBalance;
  }

  async fundWallet() {
    if (this.isElegibleToFund) {
      await this.defiInvesmentService.fundWallet().toPromise();
      this.sendEvent();
    }
  }

  checkFeatureFlagFaucet() {
    this.isFeatureFlagFaucet = this.remoteConfig.getFeatureFlag('ff_fundFaucet');
  }

  sendEvent() {
    this.trackService.trackEvent({
      eventLabel: 'ux_faucet_request',
    });
  }

  setIsElegibleToFund() {
    this.isFeatureFlagFaucet
      ? (this.isElegibleToFund = this.nativeTokenBalance === 0.0)
      : (this.isElegibleToFund = false);
  }

  async checkNativeTokenBalance() {
    if (this.nativeTokenBalance <= this.fee.value && !this.isElegibleToFund) {
      await this.openModalNativeTokenBalance();
      this.isNegativeBalance = true;
    } else {
      this.disable = false;
    }
  }

  async openModalNativeTokenBalance() {
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
    await this.modalController.dismiss(null, null, 'feeModal');
    if (window.location.href === this.modalHref) {
      await modal.present();
    }
  }

  async invest() {
    this.disable = true;
    await this.fundWallet();
    await this.getTokenBalanceAvailable();
    const wallet = await this.wallet();
    await this.saveTwoPiAgreement();
    if (wallet) {
      if (this.checkTokenBalance()) {
        await this.openInProgressModal();
        try {
          await (
            await this.investment(wallet).deposit(this.amount.value)
          )
            .wait()
            .then(() => this.createNotification('success'))
            .then(() => this.setActionListener())
            .then(() => this.notification.send());
        } catch {
          this.createNotification('error');
          this.notification.send();
        } finally {
          this.loadingEnabled(false);
        }
      } else {
        this.openModalTokenBalance();
      }
      this.loadingEnabled(false);
    }
  }

  private setActionListener() {
    this.notification.onClick(() => {
      this.navigateToTokenDetail();
    });
  }

  private navigateToTokenDetail() {
    this.navController.navigateRoot([
      `wallets/token-detail/blockchain/${this.token.network}/token/${this.token.contract}`,
    ]);
  }

  private createNotification(mode: string) {
    this.notification = this.localNotificationInjectable.create(
      this.translate.instant(`defi_investments.notifications.${mode}.title`),
      this.translate.instant(`defi_investments.notifications.${mode}.body`, {
        amount: this.amount.value,
        token: this.amount.token,
        date: format(new Date(), 'dd/MM/yyyy'),
      })
    );
  }

  async openInProgressModal() {
    const modal = await this.modalController.create({
      component: InProgressTransactionModalComponent,
      componentProps: {
        data: SUCCESS_TYPES.invest_in_progress,
      },
      cssClass: 'modal',
      backdropDismiss: false,
    });
    await modal.present();
  }

  private loadingEnabled(enabled: boolean) {
    this.loading = enabled;
  }

  ionViewWillLeave() {
    this.leave$.next();
    this.leave$.complete();
  }

  openTOS(): void {
    this.browserService.open({ url: this.links.twoPiTermsAndConditions });
  }

  async checkTwoPiAgreement(): Promise<void> {
    this.agreement = await this.storage.get('_agreement_2PI_T&C');
    if (this.agreement) {
      this.form.patchValue({ thirdPartyDisclaimer: true, termsAndConditions: true });
    }
  }

  saveTwoPiAgreement(): Promise<any> {
    return this.storage.set('_agreement_2PI_T&C', true);
  }

  private updateTexts() {
    switch (this.mode) {
      case 'invest':
        this.headerText = 'defi_investments.confirmation.header';
        this.labelText = 'defi_investments.confirmation.amount_to_invest';
        return;
      case 'add':
        this.headerText = 'defi_investments.add.header';
        this.labelText = 'defi_investments.add.amount_to_add';
        return;
    }
  }
}
