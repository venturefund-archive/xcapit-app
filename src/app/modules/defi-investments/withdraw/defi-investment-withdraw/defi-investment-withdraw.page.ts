import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TwoPiProduct } from '../../shared-defi-investments/models/two-pi-product/two-pi-product.model';
import { InvestmentProduct } from '../../shared-defi-investments/interfaces/investment-product.interface';
import { Coin } from '../../../wallets/shared-wallets/interfaces/coin.interface';
import { TwoPiApi } from '../../shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { ApiWalletService } from '../../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { WalletEncryptionService } from '../../../wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import {
  Investment,
  TwoPiInvestment,
} from '../../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { VoidSigner, Wallet } from 'ethers';
import { Amount } from '../../shared-defi-investments/types/amount.type';
import { WalletPasswordComponent } from '../../../wallets/shared-wallets/components/wallet-password/wallet-password.component';
import { ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynamicPrice } from '../../../../shared/models/dynamic-price/dynamic-price.model';
import { FormattedFee } from '../../shared-defi-investments/models/formatted-fee/formatted-fee.model';
import { NativeFeeOf } from '../../shared-defi-investments/models/native-fee-of/native-fee-of.model';
import { TotalFeeOf } from '../../shared-defi-investments/models/total-fee-of/total-fee-of.model';
import { ERC20Provider } from '../../shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { Fee } from '../../shared-defi-investments/interfaces/fee.interface';
import { GasFeeOf } from '../../shared-defi-investments/models/gas-fee-of/gas-fee-of.model';
import { TwoPiContract } from '../../shared-defi-investments/models/two-pi-contract/two-pi-contract.model';
import { WalletBalanceService } from 'src/app/modules/wallets/shared-wallets/services/wallet-balance/wallet-balance.service';

@Component({
  selector: 'app-defi-investment-withdraw',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'defi_investments.withdraw.withdraw.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div
        class="defi-investment-withdraw-card"
        *ngIf="this.amount && this.token && this.quoteAmount && this.fee && this.quoteFee"
      >
        <app-defi-investment-withdraw-card
          [amount]="this.amount"
          [token]="this.token"
          [quoteAmount]="this.quoteAmount"
          [fee]="this.fee"
          [quoteFee]="quoteFee"
          [loading]="this.loading"
          (withdrawClicked)="this.withdraw()"
        ></app-defi-investment-withdraw-card>
      </div>
    </ion-content>
  `,
  styleUrls: ['./defi-investment-withdraw.page.scss'],
})
export class DefiInvestmentWithdrawPage implements OnInit {
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
    private twoPiApi: TwoPiApi,
    private apiWalletService: ApiWalletService,
    private walletEncryptionService: WalletEncryptionService,
    private modalController: ModalController,
    private translate: TranslateService,
    private toastService: ToastService,
    private navController: NavController,
    private walletBalance: WalletBalanceService
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {
    await this.getInvestmentProduct();
    this.getToken();
    await this.getProductBalance(this.investmentProduct);
    await this.getFee();
    this.tokenDynamicPrice();
    this.nativeDynamicPrice();
  }

  private vaultID() {
    return this.route.snapshot.paramMap.get('vault');
  }

  async getInvestmentProduct() {
    this.investmentProduct = new TwoPiProduct(await this.twoPiApi.vault(this.vaultID()), this.apiWalletService);
  }

  getToken() {
    this.token = this.investmentProduct.token();
  }

  createErc20Provider() {
    return new ERC20Provider(this.token);
  }

  private async getFee() {
    const fee = new FormattedFee(
      new NativeFeeOf(new TotalFeeOf([await this.withdrawFee()]), this.createErc20Provider().value())
    );
    this.fee = { value: await fee.value(), token: this.native().value };
  }

  private native(): Coin {
    return this.apiWalletService.getCoinsFromNetwork(this.token.network).find((coin) => coin.native);
  }

  async withdrawFeeContract(): Promise<TwoPiContract> {
    return new TwoPiContract(
      this.investmentProduct.contractAddress(),
      this.createErc20Provider(),
      new VoidSigner((await this.walletEncryptionService.getEncryptedWallet()).addresses[this.token.network])
    );
  }

  private async withdrawFee(): Promise<Fee> {
    return new GasFeeOf((await this.withdrawFeeContract()).value(), 'withdrawAll', [this.investmentProduct.id()]);
  }

  private tokenDynamicPrice() {
    this.createDynamicPrice(this.token)
      .value()
      .pipe(takeUntil(this.leave$))
      .subscribe((price: number) => {
        this.quoteAmount.value = price * this.amount.value;
      });
  }

  private nativeDynamicPrice() {
    this.createDynamicPrice(this.native())
      .value()
      .pipe(takeUntil(this.leave$))
      .subscribe((price: number) => {
        this.quoteFee.value = price * this.fee.value;
      });
  }

  createDynamicPrice(token: Coin): DynamicPrice {
    return DynamicPrice.create(this.priceRefreshInterval, token, this.apiWalletService);
  }

  investment(wallet: Wallet): Investment {
    return TwoPiInvestment.create(this.investmentProduct, wallet, this.apiWalletService);
  }

  async getProductBalance(investmentProduct: InvestmentProduct): Promise<void> {
    const wallet = await this.walletEncryptionService.getEncryptedWallet();
    const address = wallet.addresses[investmentProduct.token().network];
    const investment = this.createInvestment(investmentProduct, address);
    const balance = await investment.balance();
    this.amount = { value: balance, token: this.token.value };
  }

  createInvestment(investmentProduct: InvestmentProduct, address: string): TwoPiInvestment {
    return TwoPiInvestment.create(investmentProduct, new VoidSigner(address), this.apiWalletService);
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
        try {
          await (await this.investment(wallet).withdraw()).wait();
          await this.navController.navigateForward('/defi/withdraw/success');
        } catch {
          await this.navController.navigateForward('/defi/withdraw/error');
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
          nativeToken: this.nativeToken?.value,
        })
      ),
    });
  }

  ionViewWillLeave() {
    this.leave$.next();
    this.leave$.complete();
  }
}
