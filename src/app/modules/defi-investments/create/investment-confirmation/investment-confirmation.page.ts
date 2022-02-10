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
import { BigNumber, ethers, VoidSigner, Wallet } from 'ethers';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { ApiWalletService } from '../../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Subject } from 'rxjs';
import { DynamicPrice } from '../../../../shared/models/dynamic-price/dynamic-price.model';
import { takeUntil } from 'rxjs/operators';
import { ERC20Contract } from '../../shared-defi-investments/models/erc20-contract/erc20-contract.model';
import { ERC20Provider } from '../../shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { FormattedFee } from '../../shared-defi-investments/models/formatted-fee/formatted-fee.model';
import { FakeContract } from '../../shared-defi-investments/models/fake-contract/fake-contract.model';
import { Coin } from '../../../wallets/shared-wallets/interfaces/coin.interface';
import { GasFeeOf } from '../../shared-defi-investments/models/gas-fee-of/gas-fee-of.model';
import { TotalFeeOf } from '../../shared-defi-investments/models/total-fee-of/total-fee-of.model';
import { Fee } from '../../shared-defi-investments/interfaces/fee.interface';
import { NativeFeeOf } from '../../shared-defi-investments/models/native-fee-of/native-fee-of.model';

@Component({
  selector: 'app-investment-confirmation',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'defi_investments.confirmation.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content *ngIf="this.product">
      <ion-card class="ux-card">
        <app-expandable-investment-info [investmentProduct]="this.product"></app-expandable-investment-info>
        <div class="summary">
          <div class="summary__amount">
            <div class="summary__amount__label">
              <ion-text class="ux-font-titulo-xs">{{
                'defi_investments.confirmation.amount_to_invest' | translate
              }}</ion-text>
            </div>

            <div class="summary__amount__qty">
              <ion-text class="ux-font-text-base summary__amount__qty__amount"
                >{{ this.amount.value | number: '1.2-6' }} {{ this.amount.token }}</ion-text
              >
              <ion-text class="ux-font-text-base summary__amount__qty__quoteAmount"
                >{{ this.quoteAmount.value | number: '1.2-2' }} {{ this.quoteAmount.token }}
              </ion-text>
            </div>
          </div>
          <div class="summary__fee" *ngIf="this.fee">
            <div class="summary__fee__label">
              <ion-text class="ux-font-titulo-xs">{{
                'defi_investments.confirmation.transaction_fee' | translate
              }}</ion-text>
            </div>

            <div class="summary__fee__qty">
              <ion-text class="ux-font-text-base summary__fee__qty__amount"
                >{{ this.fee.value | number: '1.2-6' }} {{ this.fee.token }}</ion-text
              >
              <ion-text class="ux-font-text-base summary__fee__qty__quoteFee"
                >{{ this.quoteFee.value | number: '1.2-6' }} {{ this.quoteFee.token }}
              </ion-text>
            </div>
          </div>
        </div>
      </ion-card>

      <ion-button
        [appLoading]="this.loading"
        [loadingText]="'defi_investments.confirmation.submit_loading' | translate"
        appTrackClick
        name="Confirm Investment"
        expand="block"
        size="large"
        type="submit"
        class="ion-padding-start ion-padding-end ux_button"
        color="uxsecondary"
        (click)="this.invest()"
      >
        {{ 'defi_investments.confirmation.submit' | translate }}
      </ion-button>
    </ion-content>
  `,
  styleUrls: ['./investment-confirmation.page.scss'],
})
export class InvestmentConfirmationPage {
  product: InvestmentProduct;
  amount: Amount;
  quoteAmount: Amount;
  fee: Amount = { value: undefined, token: 'MATIC' };
  quoteFee: Amount = { value: undefined, token: 'USD' };
  loading = false;
  leave$ = new Subject<void>();
  private readonly priceRefreshInterval = 15000;

  constructor(
    private investmentDataService: InvestmentDataService,
    private walletService: WalletService,
    private modalController: ModalController,
    private translate: TranslateService,
    private walletEncryptionService: WalletEncryptionService,
    private navController: NavController,
    private toastService: ToastService,
    private apiWalletService: ApiWalletService
  ) {}

  async ionViewDidEnter() {
    await this.getInvestmentInfo();
    this.dynamicPrice();
    await this.walletService.walletExist();
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

  private async getInvestmentInfo() {
    this.getProduct();
    this.getAmount();
    this.getQuoteAmount();
    await this.getFee();
  }

  private getProduct() {
    this.product = this.investmentDataService.product;
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

  createErc20Provider() {
    return new ERC20Provider(this.product.token());
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
      0,
    ]);
  }

  private async depositFee(): Promise<Fee> {
    return new GasFeeOf(new FakeContract({ deposit: () => BigNumber.from('1993286') }), 'deposit', []);
  }

  private async getFee() {
    const fee = new FormattedFee(
      new NativeFeeOf(
        new TotalFeeOf([await this.approvalFee(), await this.depositFee()]),
        this.createErc20Provider().value()
      )
    );
    this.fee = { value: await fee.value(), token: this.native().value };
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
      },
      cssClass: 'ux-routeroutlet-modal small-wallet-password-modal',
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    return data;
  }

  investment(wallet: Wallet): Investment {
    return TwoPiInvestment.create(this.product, wallet);
  }

  async decryptedWallet(password: string): Promise<Wallet> {
    try {
      return await this.walletEncryptionService.getDecryptedWalletForCurrency(password, this.product.token());
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

  async invest() {
    const wallet = await this.wallet();
    if (wallet) {
      try {
        await (await this.investment(wallet).deposit(this.amount.value)).wait();
        await this.navController.navigateForward('/defi/success-investment');
      } catch {
        await this.navController.navigateForward('/defi/error-investment');
      } finally {
        this.loadingEnabled(false);
      }
    }
  }

  private loadingEnabled(enabled: boolean) {
    this.loading = enabled;
  }

  ionViewWillLeave() {
    this.leave$.next();
    this.leave$.complete();
  }
}
