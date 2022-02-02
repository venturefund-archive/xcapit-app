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
import { Wallet } from 'ethers';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { ApiWalletService } from '../../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { Subject } from 'rxjs';
import { DynamicPrice } from '../../../../shared/models/dynamic-price/dynamic-price.model';
import { takeUntil } from 'rxjs/operators';

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
                >{{ this.quoteAmount.value | number: '1.2-6' }} {{ this.quoteAmount.token }}
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
  fee: Amount = { value: undefined, token: 'USD' };
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
    this.getInvestmentInfo();
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
    return DynamicPrice.create(this.priceRefreshInterval, this.product.token(), this.apiWalletService);
  }

  private getInvestmentInfo() {
    this.getProduct();
    this.getAmount();
    this.getQuoteAmount();
    this.getEstimatedFee();
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

  private getQuoteAmount():void {
    this.quoteAmount = { value: this.investmentDataService.quoteAmount, token: 'USD' };
  }

  private getEstimatedFee():void {
    this.fee = { value: 0.025, token: this.product.token().value };
  }

  async requestPassword():Promise<any> {
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
