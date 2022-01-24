import { InvestmentProduct } from './../../shared-defi-investments/interfaces/investment-product.interface';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { TwoPiApi } from '../../shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { TwoPiProduct } from '../../shared-defi-investments/models/two-pi-investment-product/two-pi-product.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { ActivatedRoute } from '@angular/router';
import { TwoPiInvestmentService } from '../../shared-defi-investments/services/two-pi-investment/two-pi-investment.service';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-new-investment',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'defi_investments.new.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content *ngIf="this.investmentProduct">
      <ion-card class="ux-card">
        <app-expandable-investment-info [investmentProduct]="this.investmentProduct"></app-expandable-investment-info>
      </ion-card>
      <ion-card class="ux-card">
        <form [formGroup]="this.form">
          <app-amount-input-card
            title="{{ 'defi_investments.new.amount_to_invest' | translate }}"
            [baseCurrency]="this.token"
          ></app-amount-input-card>
        </form>
      </ion-card>
      <ion-button
        appTrackClick
        name="Submit Amount"
        expand="block"
        size="large"
        type="submit"
        class="ion-padding-start ion-padding-end ux_button"
        color="uxsecondary"
        (click)="this.saveAmount()"
        [disabled]="!this.form.valid"
      >
        {{ 'defi_investments.new.button' | translate }}
      </ion-button>
    </ion-content>
  `,
  styleUrls: ['./new-investment.page.scss'],
})
export class NewInvestmentPage implements OnInit {
  form: FormGroup = this.formBuilder.group({
    amount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
    quoteAmount: ['', [Validators.required]],
  });
  investmentProduct: InvestmentProduct;
  token: Coin;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public submitButtonService: SubmitButtonService,
    private apiWalletService: ApiWalletService,
    private twoPiApi: TwoPiApi,
    private twoPiInvestmentService: TwoPiInvestmentService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {
    await this.getInvestmentProduct();
    this.getToken();
  }

  private vaultID() {
    return this.route.snapshot.paramMap.get('vault');
  }

  async getInvestmentProduct() {
    this.investmentProduct = new TwoPiProduct(
      await this.twoPiApi.vault(this.vaultID()),
      this.apiWalletService
    );
    this.getToken();
  }

  getToken() {
    this.token = this.investmentProduct.token();
  }

  saveAmount() {
    if (this.form.valid) {
      this.twoPiInvestmentService.amount = this.form.value.amount;
      this.twoPiInvestmentService.quoteAmount = this.form.value.quoteAmount;
      this.twoPiInvestmentService.product = this.investmentProduct;
      this.navController.navigateForward('/defi/new/confirmation');
    }
  }
}
