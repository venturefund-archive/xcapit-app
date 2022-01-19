import { Component, OnInit } from '@angular/core';
import { InvestmentProduct } from '../../shared-defi-investments/interfaces/investment-product.interface';
import { TwoPiInvestmentService } from '../../shared-defi-investments/services/two-pi-investment/two-pi-investment.service';

@Component({
  selector: 'app-investment-confirmation',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar no-border">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/wallets"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'Nueva inversión' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content *ngIf="this.investmentProduct">
      <ion-card class="ux-card">
        <app-expandable-investment-info [investmentProduct]="this.investmentProduct"></app-expandable-investment-info>
        <div class="summary">
          <ion-item class="summary__amount">
            <div class="summary__amount__label">
              <ion-text class="ux-font-titulo-xs">{{
                'defi_investments.shared.amount_input_card.amount_to_invest' | translate
              }}</ion-text>
            </div>

            <div class="summary__amount__qty">
              <ion-text class="ux-font-text-base"
                >{{ this.amount.qty | number: '1.2-2' }} {{ this.amount.unit }}</ion-text
              >
              <ion-text class="ux-font-text-base"
                >{{ this.quoteAmount.qty | number: '1.2-2' }} {{ this.quoteAmount.unit }}
              </ion-text>
            </div>
          </ion-item>
          <div class="summary__fee">
            <ion-text class="ux-font-titulo-xs">{{ 'Fee de transacción' }}</ion-text>
          </div>
        </div>
      </ion-card>

      <ion-button
        appTrackClick
        name="Confirm Investment"
        expand="block"
        size="large"
        type="submit"
        class="ion-padding-start ion-padding-end ux_button"
        color="uxsecondary"
        (click)="this.confirm()"
      >
        {{ 'Continuar' | translate }}
      </ion-button>
    </ion-content>
  `,
  styleUrls: ['./investment-confirmation.page.scss'],
})
export class InvestmentConfirmationPage implements OnInit {
  investmentProduct: InvestmentProduct;
  amount: { qty: number; unit: string };
  quoteAmount: { qty: number; unit: string };

  constructor(private twoPiInvestmentService: TwoPiInvestmentService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getInvestmentInfo();
  }

  getInvestmentInfo() {
    this.investmentProduct = this.twoPiInvestmentService.product;
    this.amount = { qty: this.twoPiInvestmentService.amount, unit: this.investmentProduct.token().value };
    // this.quoteAmount = this.twoPiInvestmentService.quoteAmount;
    this.quoteAmount = { qty: this.twoPiInvestmentService.quoteAmount, unit: 'USD' };
  }

  confirm() {}
}
