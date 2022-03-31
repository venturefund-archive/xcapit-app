import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { VoidSigner } from 'ethers';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { AmountInputCardComponent } from '../../shared-defi-investments/components/amount-input-card/amount-input-card.component';
import { InvestmentProduct } from '../../shared-defi-investments/interfaces/investment-product.interface';
import { TwoPiApi } from '../../shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { TwoPiInvestment } from '../../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { TwoPiProduct } from '../../shared-defi-investments/models/two-pi-product/two-pi-product.model';
import { InvestmentDataService } from '../../shared-defi-investments/services/investment-data/investment-data.service';

@Component({
  selector: 'app-select-amount-withdraw',
  template:`
  <ion-header>
  <ion-toolbar color="primary" class="ux_toolbar no-border">
    <ion-buttons slot="start">
      <ion-back-button defaultHref="/tabs/wallets"></ion-back-button>
    </ion-buttons>
    <ion-title class="saw__title ion-text-center">{{ 'defi_investments.withdraw.select_amount.header' | translate }}</ion-title>
    <ion-label class="saw__step_counter" slot="end"
          >1 {{ 'shared.step_counter.of' | translate }} 2</ion-label
        >
  </ion-toolbar>
</ion-header>
<ion-content *ngIf="this.investmentProduct">
  <ion-card class="ux-card">
    <app-expandable-investment-info [investmentProduct]="this.investmentProduct"></app-expandable-investment-info>
  </ion-card>
  <ion-card class="ux-card">
    <form [formGroup]="this.form" *ngIf="this.investmentProduct && this.token">
      <app-amount-input-card
        *ngIf="this.investedAmount"
        title="{{ this.labelText | translate }}"
        [baseCurrency]="this.token"
        [investedAmount]="this.investedAmount"
      ></app-amount-input-card>
    </form>
  </ion-card>
  <div class="saw__footer">
    <ion-button
      appTrackClick
      name="Submit Amount"
      expand="block"
      size="large"
      type="submit"
      class="ion-padding-start ion-padding-end ux_button"
      color="secondary"
      (click)="this.saveAmount()"
      [disabled]="!this.form.valid"
    >
      {{ 'defi_investments.withdraw.select_amount.button' | translate }}
    </ion-button>
  </div>
</ion-content>`,
  styleUrls: ['./select-amount-withdraw.page.scss'],
})
export class SelectAmountWithdrawPage implements OnInit {
  investedAmount : number;
  form: FormGroup = this.formBuilder.group({
    amount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
    quoteAmount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
  });
  investmentProduct: InvestmentProduct;
  token: Coin;
  mode: string;
  headerText: string;
  labelText: string;
  coins: Coin[];
  buyAvailable: boolean;
  @ViewChild(AmountInputCardComponent) amountInputCard: AmountInputCardComponent;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public submitButtonService: SubmitButtonService,
    private apiWalletService: ApiWalletService,
    private twoPiApi: TwoPiApi,
    private investmentDataService: InvestmentDataService,
    private navController: NavController,
    private walletEncryptionService: WalletEncryptionService,
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.getInvestmentProduct();
    this.getToken();
    this.getCoins();
    await this.getProductBalance(this.investmentProduct);
  }

  private vaultID() {
    return this.route.snapshot.paramMap.get('vault');
  }

  async getInvestmentProduct() {
    this.investmentProduct = new TwoPiProduct(await this.twoPiApi.vault(this.vaultID()), this.apiWalletService);
  }

  getCoins() {
    this.coins = this.apiWalletService.getCoins();
    this.isMoonpayToken(this.coins);
  }

  isMoonpayToken(coins: Coin[]) {
    const coin = coins.filter((coin) => coin.value === this.token.value);
    this.buyAvailable = coin[0].hasOwnProperty('moonpayCode');
  }

  goToMoonpay() {
    this.navController.navigateForward(['fiat-ramps/moonpay']);
  }

  getToken() {
    this.token = this.investmentProduct.token();
  }

  saveAmount() {
    if (this.form.valid) {
      this.investmentDataService.amount = this.form.value.amount;
      this.investmentDataService.quoteAmount = this.form.value.quoteAmount;
      this.investmentDataService.product = this.investmentProduct;

      this.navController.navigateForward(['/defi/new/confirmation', this.mode]);
    }
  }

  ionViewWillLeave() {
    this.amountInputCard.ngOnDestroy();
  }

  async getProductBalance(investmentProduct: InvestmentProduct): Promise<void> {
    const wallet = await this.walletEncryptionService.getEncryptedWallet();
    const address = wallet.addresses[investmentProduct.token().network];
    const investment = this.createInvestment(investmentProduct, address);
    const balance = await investment.balance();
    this.investedAmount = balance
    console.log(this.investedAmount)
  }

  createInvestment(investmentProduct: InvestmentProduct, address: string): TwoPiInvestment {
    return TwoPiInvestment.create(investmentProduct, new VoidSigner(address), this.apiWalletService);
  }

}



