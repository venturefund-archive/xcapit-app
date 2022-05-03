import { IonicStorageService } from './../../../../shared/services/ionic-storage/ionic-storage.service';
import { LINKS } from 'src/app/config/static-links';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { FormBuilder, Validators } from '@angular/forms';
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
import { DefaultERC20Provider } from '../../shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { FormattedFee } from '../../shared-defi-investments/models/formatted-fee/formatted-fee.model';
import { FakeContract } from '../../shared-defi-investments/models/fake-contract/fake-contract.model';
import { Coin } from '../../../wallets/shared-wallets/interfaces/coin.interface';
import { GasFeeOf } from '../../shared-defi-investments/models/gas-fee-of/gas-fee-of.model';
import { TotalFeeOf } from '../../shared-defi-investments/models/total-fee-of/total-fee-of.model';
import { Fee } from '../../shared-defi-investments/interfaces/fee.interface';
import { NativeFeeOf } from '../../shared-defi-investments/models/native-fee-of/native-fee-of.model';
import { WalletBalanceService } from 'src/app/modules/wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { ActivatedRoute } from '@angular/router';
import { ToastWithButtonsComponent } from '../../shared-defi-investments/components/toast-with-buttons/toast-with-buttons.component';

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
    <ion-content *ngIf="this.product">
      <ion-card class="ux-card">
        <app-expandable-investment-info [investmentProduct]="this.product"></app-expandable-investment-info>
        <div class="summary">
          <div class="summary__amount">
            <div class="summary__amount__label">
              <ion-text class="ux-font-titulo-xs">{{ this.labelText | translate }}</ion-text>
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
      <form [formGroup]="this.form" class="ion-padding-horizontal ion-padding-bottom">
        <ion-item class="term-item ion-no-padding ion-no-margin">
          <ion-checkbox formControlName="thirdPartyDisclaimer" mode="md" slot="start"></ion-checkbox>
          <ion-label class="ion-no-padding ion-no-margin">
            <ion-text class="ux-font-text-xxs" color="neutral80">
              {{ 'defi_investments.confirmation.terms.third_party_disclaimer' | translate }}
            </ion-text>
          </ion-label>
        </ion-item>

        <ion-item class="term-item ion-no-padding ion-no-margin">
          <ion-checkbox formControlName="termsAndConditions" mode="md" slot="start"></ion-checkbox>
          <ion-label class="ion-no-padding ion-no-margin checkbox-link">
            <ion-text class="ux-font-text-xxs" color="neutral80">{{
              'defi_investments.confirmation.terms.i_have_read' | translate
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
        name="Confirm Investment"
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
  token: Coin;
  available: number;
  nativeToken: Coin;
  nativeTokenBalance: number;
  amount: Amount;
  quoteAmount: Amount;
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

  constructor(
    private investmentDataService: InvestmentDataService,
    private walletService: WalletService,
    private modalController: ModalController,
    private translate: TranslateService,
    private walletEncryptionService: WalletEncryptionService,
    private navController: NavController,
    private toastService: ToastService,
    private apiWalletService: ApiWalletService,
    private walletBalance: WalletBalanceService,
    private formBuilder: FormBuilder,
    private browserService: BrowserService,
    private storage: IonicStorageService,
    private route: ActivatedRoute
  ) {}

  async ionViewDidEnter() {
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.updateTexts();
    await this.getInvestmentInfo();
    this.dynamicPrice();
    this.checkTwoPiAgreement();
    await this.walletService.walletExist();
    await this.getNativeTokenBalance();
    this.checkNativeTokenBalance();
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
    return new GasFeeOf((await this.approveFeeContract()).value(), 'approve', [this.product.contractAddress(), 0]);
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

  getToken() {
    return (this.token = this.product.token());
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
    await this.getToken();
    this.nativeToken = this.apiWalletService
      .getCoins()
      .find((coin) => coin.native && coin.network === this.token.network);
    this.nativeTokenBalance = await this.walletBalance.balanceOf(this.nativeToken);
    return this.nativeTokenBalance;
  }

  checkNativeTokenBalance() {
    if (this.nativeTokenBalance <= this.fee.value) {
      this.openModalNativeTokenBalance();
    } else {
      this.disable = false;
    }
  }

  async openModalNativeTokenBalance() {
    const modal = await this.modalController.create({
      component: ToastWithButtonsComponent,
      cssClass: 'ux-toast-warning',
      showBackdrop: false,
      componentProps: {
        text: this.translate.instant('defi_investments.confirmation.informative_modal_fee', {
          nativeToken: this.nativeToken?.value,
        }),
        firstButtonName: this.translate.instant('defi_investments.confirmation.buy_button', {
          nativeToken: this.nativeToken?.value,
        }),
        secondaryButtonName: this.translate.instant('defi_investments.confirmation.deposit_button', {
          nativeToken: this.nativeToken?.value,
        }),
        firstLink: '/fiat-ramps/moonpay',
        secondLink: '/wallets/receive/detail',
        data: this.nativeToken,
      },
    });
    modal.present();
  }

  async invest() {
    this.disable = true;
    await this.getTokenBalanceAvailable();
    const wallet = await this.wallet();
    if (wallet) {
      if (this.checkTokenBalance()) {
        try {
          await (await this.investment(wallet).deposit(this.amount.value)).wait();
          await this.saveTwoPiAgreement();
          await this.navController.navigateForward(['/defi/success-investment', this.mode]);
        } catch {
          await this.navController.navigateForward([
            '/defi/error-investment',
            this.investmentDataService.product.name(),
          ]);
        } finally {
          this.loadingEnabled(false);
        }
      } else {
        this.openModalTokenBalance();
      }
      this.loadingEnabled(false);
    }
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
    const agreement = await this.storage.get('_agreement_2PI_T&C');
    if (agreement) {
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
