import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { VoidSigner } from 'ethers';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { AmountInputCardComponent } from 'src/app/shared/components/amount-input-card/amount-input-card.component';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { InvestmentProduct } from '../../shared-defi-investments/interfaces/investment-product.interface';
import { TwoPiApi } from '../../shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { TwoPiInvestment } from '../../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { TwoPiProduct } from '../../shared-defi-investments/models/two-pi-product/two-pi-product.model';
import { InvestmentDataService } from '../../shared-defi-investments/services/investment-data/investment-data.service';
import { takeUntil } from 'rxjs/operators';
import { DynamicPrice } from '../../../../shared/models/dynamic-price/dynamic-price.model';
import { Subject } from 'rxjs';
import { DynamicPriceFactory } from '../../../../shared/models/dynamic-price/factory/dynamic-price-factory';
import { TwoPiInvestmentFactory } from '../../shared-defi-investments/models/two-pi-investment/factory/two-pi-investment-factory';

@Component({
  selector: 'app-select-amount-withdraw',
  template: ` <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar ux_toolbar__rounded ux_toolbar__left no-border">
        <ion-buttons slot="start">
          <ion-back-button class="saw__back" defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-start">{{ 'defi_investments.withdraw.select_amount.header' | translate }}</ion-title>
        <ion-label class="ux-font-text-xs ux_toolbar__step" slot="end"
          >1 {{ 'shared.step_counter.of' | translate }} 2</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content *ngIf="this.investmentProduct">
      <ion-card class="ux-card no-border saw__expandable_info">
        <app-expandable-investment-info [investmentProduct]="this.investmentProduct"></app-expandable-investment-info>
      </ion-card>
      <ion-card class="ux-card no-border saw__amount_card">
        <form [formGroup]="this.form" *ngIf="this.investmentProduct && this.token">
          <app-amount-input-card
            *ngIf="this.investedAmount"
            [label]="'defi_investments.withdraw.select_amount.label' | translate"
            [baseCurrency]="this.token"
            [showRange]="true"
            [max]="this.investedAmount"
            [quotePrice]="this.quotePrice"
            [header]="'defi_investments.shared.amount_input_card.amount_invested' | translate"
            [disclaimer]="false"
          ></app-amount-input-card>
          <app-amount-input-card-skeleton
            *ngIf="!this.investedAmount"
            [showRange]="true"
          ></app-amount-input-card-skeleton>
        </form>
      </ion-card>
      <div class="ux-font-text-xs saw__legend">
        <ion-label *ngIf="this.investedAmount">
          {{
            'defi_investments.withdraw.select_amount.legend' | translate: { token: this.token.value, network: this.token.network }
          }}</ion-label
        >
        <ion-skeleton-text *ngIf="!this.investedAmount" animated class="saw__legend__skeleton"></ion-skeleton-text>
      </div>
      <div class="saw__button">
        <ion-button
          *ngIf="this.investedAmount"
          appTrackClick
          name="ux_invest_continue"
          expand="block"
          size="large"
          type="submit"
          class="ux_button"
          color="secondary"
          (click)="this.saveWithdrawAmount()"
          [disabled]="!this.form.valid"
        >
          {{ 'defi_investments.withdraw.select_amount.button' | translate }}
        </ion-button>
        <ion-skeleton-text *ngIf="!this.investedAmount" animated class="saw__button__skeleton"></ion-skeleton-text>
      </div>
    </ion-content>`,
  styleUrls: ['./select-amount-withdraw.page.scss'],
})
export class SelectAmountWithdrawPage implements OnInit {
  destroy$ = new Subject<void>();
  private priceRefreshInterval = 15000;
  quotePrice: number;
  investedAmount: number;
  feeToken: Coin;
  form: UntypedFormGroup = this.formBuilder.group({
    percentage: [0],
    range: [''],
    amount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
    quoteAmount: ['', [Validators.required]],
  });
  investmentProduct: InvestmentProduct;
  token: Coin;
  mode: string;
  coins: Coin[];
  @ViewChild(AmountInputCardComponent) amountInputCard: AmountInputCardComponent;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private apiWalletService: ApiWalletService,
    private twoPiApi: TwoPiApi,
    private investmentDataService: InvestmentDataService,
    private navController: NavController,
    private walletEncryptionService: WalletEncryptionService,
    private dynamicPriceFactory: DynamicPriceFactory,
    private twoPiInvestmentFactory: TwoPiInvestmentFactory
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.setInvestmentProduct();
    this.setToken();
    this.setFeeToken();
    this.dynamicPrice();
    await this.setBalanceFor(this.investmentProduct);
  }

  private dynamicPrice() {
    this.createDynamicPrice()
      .value()
      .pipe(takeUntil(this.destroy$))
      .subscribe((price: number) => (this.quotePrice = price));
  }

  createDynamicPrice(): DynamicPrice {
    return this.dynamicPriceFactory.new(this.priceRefreshInterval, this.token, this.apiWalletService);
  }

  private vaultID() {
    return this.route.snapshot.paramMap.get('vault');
  }

  async setInvestmentProduct() {
    this.investmentProduct = new TwoPiProduct(await this.twoPiApi.vault(this.vaultID()), this.apiWalletService);
  }

  setToken() {
    this.token = this.investmentProduct.token();
  }

  saveWithdrawAmount() {
    if (this.form.valid) {
      this.investmentDataService.amount = parseFloat(this.form.value.amount);
      this.investmentDataService.quoteAmount = parseFloat(this.form.value.quoteAmount);
      this.investmentDataService.product = this.investmentProduct;
      const url = ['/defi/withdraw/confirmation', this.vaultID()];
      if (this.form.value.range === 100) url.push('all');
      this.navController.navigateForward(url);
    }
  }

  private setFeeToken() {
    this.feeToken = this.apiWalletService.getCoins().find((coin) => coin.native && coin.network === this.token.network);
  }

  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async setBalanceFor(anInvestmentProduct: InvestmentProduct): Promise<void> {
    const wallet = await this.walletEncryptionService.getEncryptedWallet();
    const address = wallet.addresses[anInvestmentProduct.token().network];
    const investment = this.createInvestment(anInvestmentProduct, address);
    const balance = await investment.balance();
    this.investedAmount = balance;
  }

  createInvestment(investmentProduct: InvestmentProduct, address: string): TwoPiInvestment {
    return this.twoPiInvestmentFactory.new(investmentProduct, new VoidSigner(address), this.apiWalletService);
  }
}
