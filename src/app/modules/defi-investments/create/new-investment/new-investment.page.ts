import { TwoPiApi } from '../../shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { TwoPiInvestmentProduct } from '../../shared-defi-investments/models/two-pi-investment-product/two-pi-investment-product.model';
import { InvestmentProduct } from '../../shared-defi-investments/interfaces/investment-product.interface';
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
        <ion-title class="ion-text-center">{{ 'Nueva inversión' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content *ngIf="this.investmentProduct">
      <ion-card class="ux-card">
        <app-expandable-investment-info [investmentProduct]="this.investmentProduct"></app-expandable-investment-info>
      </ion-card>
      <ion-card class="ux-card">
        <form [formGroup]="this.form">
          <app-amount-input-card
            title="Monto a invertir"
            [baseCurrency]="this.investmentProduct.token"
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
        {{ 'Continuar' | translate }}
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

  ionViewWillEnter() {
    this.getInvestmentProduct();
  }

  private vaultID() {
    return this.route.snapshot.paramMap.get('vault');
  }

  getInvestmentProduct() {
    this.twoPiApi.vault(this.vaultID()).then((vault) => {
      this.investmentProduct = new TwoPiInvestmentProduct(vault, this.apiWalletService);
    });
  }

  saveAmount() {
    if (this.form.valid) {
      this.twoPiInvestmentService.depositAmount = this.form.value.amount;
      this.navController.navigateForward(['defi/new/summary']);
    }
  }
}
