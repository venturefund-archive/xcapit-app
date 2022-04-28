import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { VoidSigner } from 'ethers';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { AmountInputCardComponent } from '../../shared-defi-investments/components/amount-input-card/amount-input-card.component';
import { InvestmentProduct } from '../../shared-defi-investments/interfaces/investment-product.interface';
import { TwoPiApi } from '../../shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { TwoPiInvestment } from '../../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { TwoPiProduct } from '../../shared-defi-investments/models/two-pi-product/two-pi-product.model';
import { InvestmentDataService } from '../../shared-defi-investments/services/investment-data/investment-data.service';

@Component({
  selector: 'app-select-amount-withdraw',
  template: ` <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button class="saw__back" defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-start">{{ 'defi_investments.withdraw.select_amount.header' | translate }}</ion-title>
        <ion-label class="ux-font-text-xs saw__step_counter" slot="end"
          >1 {{ 'shared.step_counter.of' | translate }} 2</ion-label
        >
      </ion-toolbar>
    </ion-header>
    <ion-content *ngIf="this.investmentProduct">
      <ion-card class="ux-card saw__expandable_info">
        <app-expandable-investment-info [investmentProduct]="this.investmentProduct"></app-expandable-investment-info>
      </ion-card>
      <ion-card class="ux-card saw__amount_card">
        <form [formGroup]="this.form" *ngIf="this.investmentProduct && this.token">
          <app-amount-input-card
            *ngIf="this.investedAmount"
            [label]="'defi_investments.withdraw.select_amount.label' | translate"
            [baseCurrency]="this.token"
            [investedAmount]="this.investedAmount"
            [showRange]="true"
            [header]="'defi_investments.shared.amount_input_card.amount_invested' | translate"
          ></app-amount-input-card>
        </form>
      </ion-card>
      <div class="saw__footer">
        <ion-button
          appTrackClick
          name="submit_withdraw_amount"
          expand="block"
          size="large"
          type="submit"
          class="ion-padding-start ion-padding-end ux_button"
          color="secondary"
          (click)="this.saveWithdrawAmount()"
          [disabled]="!this.form.valid"
        >
          {{ 'defi_investments.withdraw.select_amount.button' | translate }}
        </ion-button>
      </div>
    </ion-content>`,
  styleUrls: ['./select-amount-withdraw.page.scss'],
})
export class SelectAmountWithdrawPage implements OnInit {
  investedAmount: number;
  form: FormGroup = this.formBuilder.group({
    percentage: [0],
    range: [''],
    amount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
    quoteAmount: ['', [Validators.required, CustomValidators.greaterThan(0)]],
  });
  investmentProduct: InvestmentProduct;
  token: Coin;
  mode: string;
  headerText: string;
  coins: Coin[];
  buyAvailable: boolean;
  @ViewChild(AmountInputCardComponent) amountInputCard: AmountInputCardComponent;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private apiWalletService: ApiWalletService,
    private twoPiApi: TwoPiApi,
    private investmentDataService: InvestmentDataService,
    private navController: NavController,
    private walletEncryptionService: WalletEncryptionService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    await this.setInvestmentProduct();
    this.setToken();
    await this.setBalanceFor(this.investmentProduct);
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
      this.investmentDataService.amount = this.form.value.amount;
      this.investmentDataService.quoteAmount = this.form.value.quoteAmount;
      this.investmentDataService.product = this.investmentProduct;
      const url = ['/defi/withdraw/confirmation', this.vaultID()];
      if (this.form.value.range === 100) url.push('all');
      this.navController.navigateForward(url);
    }
  }

  ionViewWillLeave() {
    this.amountInputCard.ngOnDestroy();
  }

  async setBalanceFor(anInvestmentProduct: InvestmentProduct): Promise<void> {
    const wallet = await this.walletEncryptionService.getEncryptedWallet();
    const address = wallet.addresses[anInvestmentProduct.token().network];
    const investment = this.createInvestment(anInvestmentProduct, address);
    const balance = await investment.balance();
    this.investedAmount = balance;
  }

  createInvestment(investmentProduct: InvestmentProduct, address: string): TwoPiInvestment {
    return TwoPiInvestment.create(investmentProduct, new VoidSigner(address), this.apiWalletService);
  }
}
