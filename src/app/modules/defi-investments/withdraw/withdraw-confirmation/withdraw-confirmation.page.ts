import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvestmentProduct } from '../../shared-defi-investments/interfaces/investment-product.interface';
import { Coin } from '../../../wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { WalletEncryptionService } from '../../../wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { VoidSigner, Wallet } from 'ethers';
import { Amount } from '../../shared-defi-investments/types/amount.type';
import { WalletPasswordComponent } from '../../../wallets/shared-wallets/components/wallet-password/wallet-password.component';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NativeFeeOf } from '../../shared-defi-investments/models/native-fee-of/native-fee-of.model';
import { TotalFeeOf } from '../../shared-defi-investments/models/total-fee-of/total-fee-of.model';
import { Fee } from '../../shared-defi-investments/interfaces/fee.interface';
import { WalletBalanceService } from 'src/app/modules/wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { InvestmentDataService } from '../../shared-defi-investments/services/investment-data/investment-data.service';
import { WithdrawConfirmationController } from './withdraw-confirmation.controller';

@Component({
  selector: 'app-withdraw-confirmation',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button class="wp__back" defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-start">{{ 'defi_investments.withdraw.withdraw.header' | translate }}</ion-title>
        <ion-label class="ux-font-text-xs wp__step_counter" slot="end"
          >2 {{ 'shared.step_counter.of' | translate }} 2</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content *ngIf="this.amount && this.token && this.quoteAmount && this.fee && this.quoteFee">
      <ion-card class="ux-card wp__card">
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
                >{{ this.amount.value | number: '1.2-6' }} {{ this.amount.token }}</ion-text
              >
              <ion-text class="ux-font-text-base wp__amount__qty__quoteAmount"
                >{{ this.quoteAmount.value | number: '1.2-2' }} {{ this.quoteAmount.token }}
              </ion-text>
            </div>
          </div>
          <div class="wp__fee" *ngIf="this.fee">
            <div class="wp__fee__label">
              <ion-text class="ux-font-titulo-xs">{{
                'defi_investments.withdraw.withdraw.withdraw_fee' | translate
              }}</ion-text>
            </div>

            <div class="wp__fee__qty">
              <ion-text class="ux-font-text-base wp__fee__qty__amount"
                >{{ this.fee.value | number: '1.2-6' }} {{ this.fee.token }}</ion-text
              >
              <ion-text class="ux-font-text-base wp__fee__qty__quoteFee"
                >{{ this.quoteFee.value | number: '1.2-6' }} {{ this.quoteFee.token }}
              </ion-text>
            </div>
          </div>
        </div>
      </ion-card>
      <ion-button
        [appLoading]="this.loading"
        [loadingText]="'defi_investments.withdraw.withdraw.submit_loading' | translate"
        appTrackClick
        name="confirm_withdraw"
        expand="block"
        size="large"
        type="submit"
        class="ion-padding-start ion-padding-end ux_button"
        color="secondary"
        (click)="this.withdraw()"
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
export class WithdrawConfirmationPage implements OnInit {
  disclaimer: boolean;
  investmentProduct: InvestmentProduct;
  token: Coin;
  amount: Amount;
  quoteAmount: Amount = { value: 0, token: 'USD' };
  fee: Amount = { value: 0, token: 'MATIC' };
  quoteFee: Amount = { value: 0, token: 'USD' };
  loading = false;
  leave$ = new Subject<void>();
  private readonly priceRefreshInterval = 15000;
  nativeToken: Coin;
  nativeTokenBalance: number;
  disable: boolean;

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
    private controller: WithdrawConfirmationController
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {
    this.getProduct();
    this.getAmount();
    this.getQuoteAmount();
    this.getToken();
    await this.getFee();
    this.tokenDynamicPrice();
    this.nativeDynamicPrice();
  }

  private getProduct() {
    this.investmentProduct = this.investmentDataService.product;
  }

  private getAmount() {
    this.amount = {
      value: this.investmentDataService.amount,
      token: this.investmentDataService.product.token().value,
    };
  }

  private getQuoteAmount(): void {
    this.quoteAmount = { value: this.investmentDataService.quoteAmount, token: 'USD' };
  }

  private vaultID() {
    return this.route.snapshot.paramMap.get('vault');
  }

  getToken() {
    this.token = this.investmentProduct.token();
  }

  private async getFee() {
    const fee = this.controller.createFormattedFee(
      new NativeFeeOf(
        new TotalFeeOf([await this.withdrawFee()]),
        this.controller.createErc20Provider(this.token).value()
      )
    );
    this.fee = { value: await fee.value(), token: this.native().value };
  }

  private native(): Coin {
    return this.apiWalletService.getCoinsFromNetwork(this.token.network).find((coin) => coin.native);
  }

  private async withdrawFee(): Promise<Fee> {
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
    await this.getNativeTokenBalance();
    const wallet = await this.wallet();
    if (wallet) {
      if (this.checkNativeTokenBalance()) {
        this.disclaimer = true;
        try {
          const investment = this.controller.investment(this.investmentProduct, wallet, this.apiWalletService);
          if (this.route.snapshot.paramMap.get('type') === 'all') {
            await (await investment.withdrawAll()).wait();
          } else {
            await (await investment.withdraw(this.amount.value)).wait();
          }
          await this.navController.navigateForward('/defi/withdraw/success');
        } catch {
          await this.navController.navigateForward(['/defi/withdraw/error', this.vaultID()]);
        } finally {
          this.loadingEnabled(false);
        }
      } else {
        this.openModalNativeTokenBalance();
      }
      this.loadingEnabled(false);
    }
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
          nativeToken: this.nativeToken.value,
        })
      ),
    });
  }

  ionViewWillLeave() {
    this.leave$.next();
    this.leave$.complete();
  }
}
