import { InvestmentProduct } from '../../shared-defi-investments/interfaces/investment-product.interface';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { TwoPiApi } from '../../shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { TwoPiProduct } from '../../shared-defi-investments/models/two-pi-product/two-pi-product.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { InvestmentDataService } from '../../shared-defi-investments/services/investment-data/investment-data.service';
import { AmountInputCardComponent } from '../../../../shared/components/amount-input-card/amount-input-card.component';
import { WalletBalanceService } from '../../../wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DynamicPrice } from 'src/app/shared/models/dynamic-price/dynamic-price.model';
import { DynamicPriceFactory } from '../../../../shared/models/dynamic-price/factory/dynamic-price-factory';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { WalletBackupService } from 'src/app/modules/wallets/shared-wallets/wallet-backup/wallet-backup.service';
@Component({
  selector: 'app-new-investment',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ this.headerText | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content *ngIf="this.investmentProduct">
      <ion-card class="ux-card">
        <app-expandable-investment-info
          fbPrefix="ux_invest"
          [investmentProduct]="this.investmentProduct"
        ></app-expandable-investment-info>
      </ion-card>
      <ion-card class="ux-card">
        <form [formGroup]="this.form">
          <app-amount-input-card
            *ngIf="this.investmentProduct && this.token && this.tokenBalance !== undefined"
            [label]="this.labelText | translate"
            [baseCurrency]="this.token"
            [quotePrice]="this.quotePrice"
            [showRange]="false"
            [max]="this.tokenBalance"
            [feeToken]="this.feeToken"
            [header]="'defi_investments.shared.amount_input_card.available' | translate"
          ></app-amount-input-card>
          <app-amount-input-card-skeleton
            *ngIf="this.tokenBalance === undefined"
            [showRange]="false"
          ></app-amount-input-card-skeleton>
        </form>
      </ion-card>
      <div class="ni__footer">
        <ion-button
          appTrackClick
          name="ux_invest_continue"
          expand="block"
          size="large"
          type="submit"
          class="ion-padding-start ion-padding-end ux_button"
          color="secondary"
          (click)="this.saveAmount()"
          [disabled]="!this.form.valid"
        >
          {{ 'defi_investments.new.button' | translate }}
        </ion-button>
        <div *appFeatureFlag="'ff_buyCryptoNewInvestmentFooter'">
          <div class="ni__footer__text" *ngIf="this.buyAvailable">
            <span class="ux-font-text-xs text">
              {{ 'defi_investments.new.dont_have' | translate }}{{ this.token.value + '?' }}
            </span>
            <ion-button
              name="go_to_buy"
              class="ux-link-xl ni__footer__text__button"
              (click)="this.goToBuyCrypto()"
              appTrackClick
              fill="clear"
            >
              {{ 'defi_investments.new.buy_button' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./new-investment.page.scss'],
})
export class NewInvestmentPage implements OnInit {
  destroy$ = new Subject<void>();
  private priceRefreshInterval = 15000;
  form: FormGroup = this.formBuilder.group({
    amount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
    quoteAmount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
  });
  investmentProduct: InvestmentProduct;
  token: Coin;
  tokenBalance: number;
  quotePrice: number;
  feeToken: Coin;
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
    private walletBalance: WalletBalanceService,
    private dynamicPriceFactory: DynamicPriceFactory,
    private storage: IonicStorageService,
    private walletBackupService: WalletBackupService
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {
    await this.getInvestmentProduct();
    this.getToken();
    this.dynamicPrice();
    this.setFeeToken();
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.updateTexts();
    this.getCoins();
    await this.setTokenBalance();
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

  async goToBuyCrypto() {
    if ((await this.walletBackupService.presentModal()) === 'skip') {
      const conditionsPurchasesAccepted = await this.storage.get('conditionsPurchasesAccepted');
      const url = !conditionsPurchasesAccepted ? 'fiat-ramps/buy-conditions' : 'fiat-ramps/select-provider';
      this.navController.navigateForward([url]);
    }
  }

  getToken() {
    this.token = this.investmentProduct.token();
  }

  async setTokenBalance(): Promise<void> {
    this.tokenBalance = await this.walletBalance.balanceOf(this.token);
  }

  saveAmount() {
    if (this.form.valid) {
      this.investmentDataService.amount = this.form.value.amount;
      this.investmentDataService.quoteAmount = parseFloat(this.form.value.quoteAmount);
      this.investmentDataService.product = this.investmentProduct;
      this.navController.navigateForward(['/defi/new/confirmation', this.mode]);
    }
  }

  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateTexts() {
    switch (this.mode) {
      case 'invest':
        this.headerText = 'defi_investments.new.header';
        this.labelText = 'defi_investments.new.amount_to_invest';
        return;
      case 'add':
        this.headerText = 'defi_investments.add.header';
        this.labelText = 'defi_investments.add.amount_to_add';
        return;
    }
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

  private setFeeToken() {
    this.feeToken = this.apiWalletService.getCoins().find((coin) => coin.native && coin.network === this.token.network);
  }
}
