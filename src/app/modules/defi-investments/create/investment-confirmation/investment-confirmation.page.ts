import { WalletService } from './../../../wallets/shared-wallets/services/wallet/wallet.service';
import { TwoPiApi } from '../../shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { Component, OnInit } from '@angular/core';
import { InvestmentProduct } from '../../shared-defi-investments/interfaces/investment-product.interface';
import { TwoPiInvestmentService } from '../../shared-defi-investments/services/two-pi-investment/two-pi-investment.service';
import { BlockchainProviderService } from 'src/app/modules/wallets/shared-wallets/services/blockchain-provider/blockchain-provider.service';
import { environment } from 'src/environments/environment';
import twoPiAbi from '../../shared-defi-investments/abi/2pi.json';

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
    <ion-content *ngIf="this.investmentProduct">
      <ion-card class="ux-card">
        <app-expandable-investment-info [investmentProduct]="this.investmentProduct"></app-expandable-investment-info>
        <div class="summary">
          <div class="summary__amount">
            <div class="summary__amount__label">
              <ion-text class="ux-font-titulo-xs">{{
                'defi_investments.confirmation.amount_to_invest' | translate
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
          </div>
          <div class="summary__fee">
            <div class="summary__fee__label">
              <ion-text class="ux-font-titulo-xs">{{
                'defi_investments.confirmation.transaction_fee' | translate
              }}</ion-text>
            </div>

            <div class="summary__fee__qty">
              <ion-text class="ux-font-text-base"
                >{{ this.amount.qty | number: '1.2-2' }} {{ this.amount.unit }}</ion-text
              >
              <ion-text class="ux-font-text-base"
                >{{ this.quoteAmount.qty | number: '1.2-2' }} {{ this.quoteAmount.unit }}
              </ion-text>
            </div>
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

  fee: { qty: number; unit: string };
  quoteFee: { qty: number; unit: string };

  constructor(
    private twoPiInvestmentService: TwoPiInvestmentService,
    private twoPiApi: TwoPiApi,
    private blockchainProviderService: BlockchainProviderService,
    private walletService: WalletService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.getInvestmentInfo();
    await this.walletService.walletExist();
  }

  getInvestmentInfo() {
    this.investmentProduct = this.twoPiInvestmentService.product;
    this.amount = { qty: this.twoPiInvestmentService.amount, unit: this.investmentProduct.token().value };
    this.quoteAmount = { qty: this.twoPiInvestmentService.quoteAmount, unit: 'USD' };
  }

  confirm() {
    const contract = this.blockchainProviderService.createContract(
      '0x3B353b1CBDDA3A3D648af9825Ee34d9CA816FD38',
      twoPiAbi,
      this.blockchainProviderService.createProvider(environment.maticApiUrl)
    );
    console.log(contract);
  }
}
