import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvestmentProduct } from '../../shared-defi-investments/interfaces/investment-product.interface';
import { Coin } from '../../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { WalletEncryptionService } from '../../../wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { VoidSigner, Wallet } from 'ethers';
import { Amount } from '../../shared-defi-investments/types/amount.type';
import { WalletPasswordComponent } from '../../../wallets/shared-wallets/components/wallet-password/wallet-password.component';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Fee } from '../../shared-defi-investments/interfaces/fee.interface';
import { WalletBalanceService } from 'src/app/modules/wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { InvestmentDataService } from '../../shared-defi-investments/services/investment-data/investment-data.service';
import { WithdrawConfirmationInjectable } from './withdraw-confirmation.injectable';
import { WithdrawInfoModalComponent } from '../../shared-defi-investments/components/withdraw-info-modal/withdraw-info-modal.component';
import { InProgressTransactionModalComponent } from 'src/app/shared/components/in-progress-transaction-modal/in-progress-transaction-modal.component';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { LocalNotification } from 'src/app/shared/models/local-notification/local-notification.interface';
import { LocalNotificationInjectable } from 'src/app/shared/models/local-notification/injectable/local-notification.injectable';
import { format } from 'date-fns';
import { GasStationOfFactory } from 'src/app/modules/swaps/shared-swaps/models/gas-station-of/factory/gas-station-of.factory';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { AmountOf } from 'src/app/modules/swaps/shared-swaps/models/amount-of/amount-of';

@Component({
  selector: 'app-withdraw-confirmation',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__rounded ux_toolbar__left no-border">
        <ion-buttons slot="start">
          <ion-back-button class="wp__back" defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-start">{{ 'defi_investments.withdraw.withdraw.header' | translate }}</ion-title>
        <ion-label class="ux-font-text-xs ux_toolbar__step" slot="end"
          >2 {{ 'shared.step_counter.of' | translate }} 2</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content *ngIf="this.amount && this.token && this.quoteAmount && this.fee && this.quoteFee">
      <ion-card class="ux-card wp__card no-border">
        <app-expandable-investment-info [investmentProduct]="this.investmentProduct"></app-expandable-investment-info>
        <div class="wp">
          <div class="wp__amount">
            <div class="wp__amount__label">
              <ion-text class="ux-font-titulo-xs">{{
                'defi_investments.withdraw.withdraw.withdraw_amount' | translate
              }}</ion-text>
            </div>
            <div class="wp__amount__qty">
              <ion-text class="ux-font-text-base wp__amount__qty__amount"
                >{{ this.amount.value | formattedAmount }} {{ this.amount.token }}</ion-text
              >
              <ion-text class="ux-font-text-base wp__amount__qty__quoteAmount"
                >{{ this.quoteAmount.value | formattedAmount: 10:2 }} {{ this.quoteAmount.token }}
              </ion-text>
            </div>
          </div>
          <div class="wp__fee">
            <app-transaction-fee
              [fee]="this.fee"
              [quoteFee]="this.quoteFee"
              [loadingEnabled]="false"
              [balance]="this.nativeTokenBalance"
              [defaultFeeInfo]="true"
            ></app-transaction-fee>
          </div>
          <div class="wp__withdraw">
            <div class="wp__withdraw__label">
              <ion-text class="ux-font-titulo-xs"
                >{{ 'defi_investments.withdraw.withdraw.withdraw_fee' | translate }}
              </ion-text>
              <ion-icon (click)="showWithdrawInfo()" icon="information-circle"></ion-icon>
            </div>
            <div class="wp__withdraw__qty" *ngIf="this.withdrawFee.value !== undefined">
              <ion-text class="ux-font-text-base wp__withdraw__qty__amount"
                >{{ this.withdrawFee.value | formattedAmount }} {{ this.withdrawFee.token }}</ion-text
              >
              <ion-text class="ux-font-text-base wp__withdraw__qty__quoteAmount"
                >{{ this.withdrawFeeQuote.value | formattedAmount: 10:2 }} {{ this.withdrawFeeQuote.token }}
              </ion-text>
            </div>
            <div *ngIf="this.withdrawFee.value === undefined" class="skeleton">
              <ion-skeleton-text animated> </ion-skeleton-text>
            </div>
          </div>
          <div class="wp__receive">
            <div class="wp__receive__label">
              <ion-text class="ux-font-titulo-xs"
                >{{ 'defi_investments.withdraw.withdraw.receive_aprox' | translate }}
              </ion-text>
            </div>
            <div class="wp__receive__qty" *ngIf="this.receiveAprox.value !== undefined">
              <ion-text class="ux-font-text-base wp__receive__qty__amount"
                >{{ this.receiveAprox.value | formattedAmount }} {{ this.receiveAprox.token }}</ion-text
              >
              <ion-text class="ux-font-text-base wp__receive__qty__quoteAmount"
                >{{ this.receiveAproxQuote.value | formattedAmount: 10:2 }} {{ this.receiveAproxQuote.token }}
              </ion-text>
            </div>
            <div *ngIf="this.receiveAprox.value === undefined" class="skeleton">
              <ion-skeleton-text  animated> </ion-skeleton-text>
            </div>
          </div>
          <div class="wp__loading" *ngIf="this.quoteFee.value === undefined || this.fee.value === undefined">
            <ion-text class="ux-font-text-xxs ">
              {{ 'shared.transaction_fees.loading_text' | translate }}
            </ion-text>
          </div>
        </div>
      </ion-card>
      <ion-button
        [appLoading]="this.loading"
        [loadingText]="'defi_investments.withdraw.withdraw.submit_loading' | translate"
        [disabled]="this.loading"
        appTrackClick
        name="ux_invest_withdraw_confirm"
        expand="block"
        size="large"
        type="submit"
        class="ion-padding-start ion-padding-end ux_button"
        color="secondary"
        (click)="this.confirm()"
      >
        {{ 'defi_investments.withdraw.withdraw.button' | translate }}
      </ion-button>
      <div *ngIf="this.disclaimer" class="wp__disclaimer">
        <ion-text class="ux-font-text-xxs">{{ 'defi_investments.withdraw.withdraw.disclaimer' | translate }}</ion-text>
      </div>
    </ion-content>
  `,
  styleUrls: ['./withdraw-confirmation.page.scss'],
})
export class WithdrawConfirmationPage {
  disclaimer: boolean;
  investmentProduct: InvestmentProduct;
  token: Coin;
  amount: Amount;
  quoteAmount: Amount = { value: 0, token: 'USD' };
  fee: Amount = { value: undefined, token: 'MATIC' };
  quoteFee: Amount = { value: undefined, token: 'USD' };
  loading = false;
  leave$ = new Subject<void>();
  private readonly priceRefreshInterval = 15000;
  nativeToken: Coin;
  nativeTokenBalance: number;
  disable: boolean;
  withdrawFee: Amount = { value: undefined, token: 'MATIC' };
  withdrawFeeQuote: Amount = { value: undefined, token: 'USD' };
  fixedWithdrawCost = 0.00255;
  isInfoModalOpen = false;
  receiveAprox: Amount = { value: undefined, token: 'MATIC' };
  receiveAproxQuote: Amount = { value: undefined, token: 'USD' };
  notification: LocalNotification;
  constructor(
    private route: ActivatedRoute,
    private apiWalletService: ApiWalletService,
    private walletEncryptionService: WalletEncryptionService,
    private modalController: ModalController,
    private translate: TranslateService,
    private toastService: ToastService,
    private navController: NavController,
    private walletBalance: WalletBalanceService,
    private investmentDataService: InvestmentDataService,
    private controller: WithdrawConfirmationInjectable,
    private alertController: AlertController,
    private localNotificationInjectable: LocalNotificationInjectable,
    private gasStation: GasStationOfFactory,
    private blockchains: BlockchainsFactory
  ) {}

  async ionViewDidEnter() {
    await this.setInvestmentInfo();
    await this.getNativeTokenBalance();
    this.tokenDynamicPrice();
    this.nativeDynamicPrice();
    this.getWithdrawFee();
    this.getWithdrawFeeQuote();
    this.getReceive();
    this.getReceiveQuote();
  }

  private async setInvestmentInfo() {
    this.setProduct();
    this.setAmount();
    this.setQuoteAmount();
    this.setProductToken();
    await this.setFee();
  }

  private getReceive() {
    this.receiveAprox = {
      value: this.amount.value - this.withdrawFee.value,
      token: this.amount.token,
    };
  }

  private getReceiveQuote() {
    this.receiveAproxQuote = {
      value: this.quoteAmount.value - this.withdrawFeeQuote.value,
      token: this.quoteAmount.token,
    };
  }

  private setProduct() {
    this.investmentProduct = this.investmentDataService.product;
  }

  private setAmount() {
    this.amount = {
      value: this.investmentDataService.amount,
      token: this.investmentDataService.product.token().value,
    };
  }

  private getWithdrawFee() {
    this.withdrawFee = {
      value: this.amount.value * this.fixedWithdrawCost,
      token: this.amount.token,
    };
  }

  private getWithdrawFeeQuote() {
    this.withdrawFeeQuote = {
      value: this.quoteAmount.value * this.fixedWithdrawCost,
      token: this.quoteAmount.token,
    };
  }

  private setQuoteAmount(): void {
    this.quoteAmount = { value: this.investmentDataService.quoteAmount, token: 'USD' } as Amount;
  }


  private setProductToken() {
    this.token = this.investmentProduct.token();
  }

  private async setFee() {
    this.fee = (await this._gasPrice()).times((await (await this.withdrawFeeAmount()).value()).toNumber()).json();
  }

  private async _gasPrice(): Promise<AmountOf> {
    return await this.gasStation.create(this.blockchains.create().oneByName(this.token.network)).price().standard();
  }

  private native(): Coin {
    return this.apiWalletService.getCoinsFromNetwork(this.token.network).find((coin) => coin.native);
  }

  private async withdrawFeeAmount(): Promise<Fee> {
    const address = (await this.walletEncryptionService.getEncryptedWallet()).addresses[this.token.network];
    const signer = new VoidSigner(address);
    const erc20Provider = this.controller.createErc20Provider(this.token);
    const contract = await this.controller.withdrawFeeContract(this.investmentProduct, erc20Provider, signer);
    return this.controller.createGasFeeOf(contract.value(), 'withdraw', [
      this.investmentProduct.id(),
      this.controller
        .investment(this.investmentProduct, signer, this.apiWalletService)
        .amountToShare(this.amount.value),
    ]);
  }

  private tokenDynamicPrice() {
    this.controller
      .createDynamicPrice(this.priceRefreshInterval, this.token, this.apiWalletService)
      .value()
      .pipe(takeUntil(this.leave$))
      .subscribe((price: number) => {
        this.quoteAmount.value = price * this.amount.value;
      });
  }

  private nativeDynamicPrice() {
    this.controller
      .createDynamicPrice(this.priceRefreshInterval, this.native(), this.apiWalletService)
      .value()
      .pipe(takeUntil(this.leave$))
      .subscribe((price: number) => {
        this.quoteFee.value = price * this.fee.value;
      });
  }

  async requestPassword(): Promise<any> {
    const modal = await this.modalController.create({
      component: WalletPasswordComponent,
      componentProps: {
        title: this.translate.instant('defi_investments.confirmation.password_modal.title'),
        description: this.translate.instant('defi_investments.withdraw.password_modal.description'),
        inputLabel: this.translate.instant('defi_investments.confirmation.password_modal.input_label'),
        submitButtonText: this.translate.instant('defi_investments.withdraw.password_modal.confirm_button'),
        state: 'invest_withdraw',
        disclaimer: '',
      },
      cssClass: 'ux-routeroutlet-modal small-wallet-password-modal',
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    return data;
  }

  async decryptedWallet(password: string): Promise<Wallet> {
    try {
      return await this.walletEncryptionService.getDecryptedWalletForCurrency(password, this.investmentProduct.token());
    } catch {
      this.loadingEnabled(false);
      await this.toastService.showErrorToast({
        message: this.translate.instant('defi_investments.confirmation.password_error'),
      });
    }
  }

  async wallet(): Promise<Wallet | void> {
    const password = await this.requestPassword();
    if (password) {
      this.loadingEnabled(true);
      return await this.decryptedWallet(password);
    }
  }

  private loadingEnabled(enabled: boolean) {
    this.loading = enabled;
  }

  async withdraw() {
    const wallet = await this.wallet();
    if (wallet) {
      if (this.checkNativeTokenBalance()) {
        this.disclaimer = true;
        await this.openInProgressModal();
        try {
          const investment = this.controller.investment(this.investmentProduct, wallet, this.apiWalletService);
          if (this.route.snapshot.paramMap.get('type') === 'all') {
            await (await investment.withdrawAll())
            .wait()
            .then(() => this._sendSuccessNotification());
          } else {
            await (await investment.withdraw(this.amount.value))
            .wait()
            .then(() => this._sendSuccessNotification());
          }
        } catch {
          this.createNotification('error');
          this.notification.send();
        } finally {
          this.loadingEnabled(false);
        }
      } else {
        this.openModalNativeTokenBalance();
      }
      this.loadingEnabled(false);
    }
    this.loadingEnabled(false);
  }

  private _sendSuccessNotification() {
   this.createNotification('success');
   this.setActionListener();
    this.notification.send();
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
      this.translate.instant(`defi_investments.withdraw_notifications.${mode}.title`),
      this.translate.instant(`defi_investments.withdraw_notifications.${mode}.body`, {
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
        data: SUCCESS_TYPES.withdraw_in_progress,
      },
      cssClass: 'modal',
      backdropDismiss: false,
    });
    await modal.present();
  }

  async confirm() {
    this.loadingEnabled(true);
    !this.quoteFee.value ? await this.showAlert() : this.withdraw();
  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('defi_investments.withdraw.withdraw.header_alert'),
      message: this.translate.instant('defi_investments.withdraw.withdraw.alert_message'),
      cssClass: 'ux-alert-confirm',
      backdropDismiss: false,
      buttons: [
        {
          text: this.translate.instant('defi_investments.withdraw.withdraw.alert_cancel'),
          cssClass: 'secondary-button',
          handler: (_) => {
            this.loadingEnabled(false);
          },
        },

        {
          text: this.translate.instant('defi_investments.withdraw.withdraw.alert_confirmation'),
          cssClass: 'primary-button',
          handler: (_) => {
            this.withdraw();
          },
        },
      ],
    });
    await alert.present();
  }

  async getNativeTokenBalance() {
    this.nativeToken = this.apiWalletService
      .getCoins()
      .find((coin) => coin.native && coin.network === this.token.network);
    this.nativeTokenBalance = await this.walletBalance.balanceOf(this.nativeToken);
    return this.nativeTokenBalance;
  }

  checkNativeTokenBalance() {
    return this.nativeTokenBalance >= this.fee.value ? true : false;
  }

  openModalNativeTokenBalance() {
    this.toastService.showWarningToast({
      message: this.translate.instant(
        this.translate.instant('defi_investments.confirmation.informative_modal_fee', {
          token: this.nativeToken.value,
        })
      ),
    });
  }

  async showWithdrawInfo() {
    if (this.isInfoModalOpen === false) {
      this.isInfoModalOpen = true;
      const modal = await this.modalController.create({
        component: WithdrawInfoModalComponent,
        componentProps: {},
        cssClass: 'ux-modal-withdraw-info',
        backdropDismiss: false,
      });
      await modal.present();
      this.isInfoModalOpen = false;
    }
  }

  ionViewWillLeave() {
    this.leave$.next();
    this.leave$.complete();
  }
}


