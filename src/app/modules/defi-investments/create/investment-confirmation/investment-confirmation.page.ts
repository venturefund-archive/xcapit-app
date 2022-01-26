import { TwoPiInvestment } from './../../shared-defi-investments/models/two-pi-investment/two-pi-investment.model';
import { InvestmentProduct } from './../../shared-defi-investments/interfaces/investment-product.interface';
import { TranslateService } from '@ngx-translate/core';
import { WalletPasswordComponent } from './../../../wallets/shared-wallets/components/wallet-password/wallet-password.component';
import { ModalController } from '@ionic/angular';
import { WalletService } from './../../../wallets/shared-wallets/services/wallet/wallet.service';
import { Component, OnInit } from '@angular/core';
import { InvestmentDataService } from '../../shared-defi-investments/services/investment-data/investment-data.service';
import { Amount } from '../../shared-defi-investments/types/amount.type';
import { WalletEncryptionService } from 'src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service';

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
    <ion-content *ngIf="this.product">
      <ion-card class="ux-card">
        <app-expandable-investment-info [investmentProduct]="this.product"></app-expandable-investment-info>
        <div class="summary">
          <div class="summary__amount">
            <div class="summary__amount__label">
              <ion-text class="ux-font-titulo-xs">{{
                'defi_investments.confirmation.amount_to_invest' | translate
              }}</ion-text>
            </div>

            <div class="summary__amount__qty">
              <ion-text class="ux-font-text-base"
                >{{ this.amount.value | number: '1.2-2' }} {{ this.amount.token }}</ion-text
              >
              <ion-text class="ux-font-text-base"
                >{{ this.quoteAmount.value | number: '1.2-2' }} {{ this.quoteAmount.token }}
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
                >{{ this.amount.value | number: '1.2-2' }} {{ this.amount.token }}</ion-text
              >
              <ion-text class="ux-font-text-base"
                >{{ this.quoteAmount.value | number: '1.2-2' }} {{ this.quoteAmount.token }}
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
        (click)="this.requestPassword()"
      >
        {{ 'Continuar' | translate }}
      </ion-button>
    </ion-content>
  `,
  styleUrls: ['./investment-confirmation.page.scss'],
})
export class InvestmentConfirmationPage implements OnInit {
  product: InvestmentProduct;
  amount: Amount;
  quoteAmount: Amount;

  fee: Amount;
  quoteFee: Amount;

  constructor(
    private investmentDataService: InvestmentDataService,
    private walletService: WalletService,
    private modalController: ModalController,
    private translate: TranslateService,
    private walletEncryptionService: WalletEncryptionService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.getInvestmentInfo();
    await this.walletService.walletExist();
  }

  getInvestmentInfo() {
    this.amount = {
      value: this.investmentDataService.amount,
      token: this.investmentDataService.product.token().value,
    };
    this.quoteAmount = { value: this.investmentDataService.quoteAmount, token: 'USD' };
  }

  async requestPassword() {
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
    const { data } = await modal.onDidDismiss();
    this.confirm(data);
  }

  async confirm(data: string) {
    const investment = new TwoPiInvestment(this.product, await this.walletEncryptionService.getDecryptedWallet(data));
  }
}
