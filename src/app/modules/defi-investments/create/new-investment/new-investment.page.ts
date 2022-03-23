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
import { AmountInputCardComponent } from '../../shared-defi-investments/components/amount-input-card/amount-input-card.component';
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
        <app-expandable-investment-info [investmentProduct]="this.investmentProduct"></app-expandable-investment-info>
      </ion-card>
      <ion-card class="ux-card">
        <form [formGroup]="this.form" *ngIf="this.investmentProduct && this.token">
          <app-amount-input-card
            title="{{ this.labelText | translate }}"
            [baseCurrency]="this.token"
          ></app-amount-input-card>
        </form>
      </ion-card>
      <div class="ni__footer">
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
          {{ 'defi_investments.new.button' | translate }}
        </ion-button>
        <div *appFeatureFlag="'ff_buyCryptoNewInvestmentFooter'">
          <div class="ni__footer__text" *ngIf="this.mode === 'invest' && this.buyAvailable">
            <span class="ux-font-text-xs text">
              {{ 'defi_investments.new.dont_have' | translate }}{{ this.token.value + '?' }}
            </span>
            <ion-button
              name="go_to_moonpay"
              class="ux-link-xl ni__footer__text__button"
              (click)="this.goToMoonpay()"
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
    private navController: NavController
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {
    await this.getInvestmentProduct();
    this.getToken();
    this.mode = this.route.snapshot.paramMap.get('mode');
    this.updateTexts();
    this.getCoins();
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
}
