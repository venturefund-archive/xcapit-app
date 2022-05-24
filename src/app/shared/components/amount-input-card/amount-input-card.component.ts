import { WalletBalanceService } from '../../../modules/wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { Coin } from '../../../modules/wallets/shared-wallets/interfaces/coin.interface';
import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';

@Component({
  selector: 'app-amount-input-card',
  template: `
    <div class="aic ion-padding">
      <div class="aic__available text-center">
        <ion-text class="ux-font-titulo-xs">
          {{ this.header }}
        </ion-text>
        <div class="aic__available__amounts">
          <ion-text *ngIf="!this.isLoaderActive" class="ux-font-text-xl">
            {{ this.max | number: '1.2-6' }} {{ this.baseCurrency.value }}</ion-text
          >
          <ion-text *ngIf="!this.isLoaderActive" class="ux-font-text-xxs">
            ≈ {{ this.quoteMax | number: '1.2-2' }} {{ this.quoteCurrency }}
          </ion-text>
        </div>
      </div>
      <div class="aic__loader" *ngIf="this.isLoaderActive && !this.showRange">
        <app-ux-loading-block minSize="40px"></app-ux-loading-block>
      </div>
      <div class="aic__content">
        <div class="aic__content__title">
          <ion-text class="ux-font-titulo-xs"> {{ this.label }}</ion-text>
        </div>
        <div *ngIf="this.showRange" class="aic__content__percentage">
          <ion-input
            appNumberInput="positiveInteger"
            formControlName="percentage"
            step="1"
            type="number"
            inputmode="numeric"
          >
            <ion-text>%</ion-text>
          </ion-input>
        </div>
        <ion-range formControlName="range" *ngIf="this.showRange" mode="md" max="100" step="10"></ion-range>
        <div class="aic__content__label">
          <ion-text class="ux-font-text-xs aic__content__label__first" position="stacked">{{
            this.baseCurrency.value
          }}</ion-text>
          <ion-text class="ux-font-text-xs aic__content__label__second" position="stacked">{{
            this.quoteCurrency
          }}</ion-text>
        </div>
        <div class="aic__content__inputs">
          <div class="aic__content__inputs__amount_with_max">
            <ion-input
              appNumberInput
              class="aic__content__inputs__amount_with_max__amount"
              formControlName="amount"
              type="number"
              inputmode="numeric"
            >
            </ion-input>
            <ion-button
              (click)="this.setMax()"
              slot="end"
              fill="clear"
              size="small"
              class="aic__content__inputs__amount_with_max__max ux-font-button"
              >{{ 'defi_investments.shared.amount_input_card.max_button' | translate }}</ion-button
            >
          </div>
          <ion-text class="aic__content__equal ux-fweight-medium ">=</ion-text>
          <ion-input
            appNumberInput
            class="aic__content__inputs__quoteAmount"
            formControlName="quoteAmount"
            type="number"
            inputmode="numeric"
          ></ion-input>
        </div>
        <div *ngIf="this.disclaimer" class="aic__content__disclaimer">
          <ion-text class="ux-font-text-xs" style="white-space: pre-wrap;"
            >{{ 'defi_investments.shared.amount_input_card.disclaimer' | translate }} {{ this.feeToken.value }}.
          </ion-text>
        </div>
      </div>
    </div>
  `,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
  styleUrls: ['./amount-input-card.component.scss'],
})
export class AmountInputCardComponent implements OnInit {
  @Input() baseCurrency: Coin;
  @Input() quoteCurrency = 'USD';
  @Input() quotePrice: number;
  @Input() label: string;
  @Input() header: string;
  @Input() disclaimer = true;
  @Input() max: number;
  @Input() showRange: boolean;
  @Input() isSend = false;
  @Input() feeToken: Coin;
  form: FormGroup;
  quoteMax: number;
  isLoaderActive: boolean;

  constructor(private formGroupDirective: FormGroupDirective) {}

  ngOnInit() {
    this.isLoaderActive = true;
    this.subscribeToFormChanges();
    this.setPrice();
  }

  defaultPatchValueOptions() {
    return { emitEvent: false, onlySelf: true };
  }

  // async ngOnChanges(changes: SimpleChanges): Promise<void> {
  //   if (changes.nativeFee?.currentValue) {
  //     const previousBalance = this.max;
  //     await this.balanceAvailable();
  //     if (this.form.value.amount === previousBalance) this.setMax();
  //   }
  // }

  setMax() {
    this.form.get('amount').patchValue(this.max);
  }

  private maxFormValues() {
    return {
      quoteAmount: this.parseAmount(this.max * this.quotePrice),
      percentage: 100,
      range: 100,
      amount: this.max,
    };
  }

  subscribeToFormChanges() {
    this.form = this.formGroupDirective.form;
    this.form.get('amount').valueChanges.subscribe((value) => this.amountChange(value));
    this.form.get('quoteAmount').valueChanges.subscribe((value) => this.quoteAmountChange(value));
    if (this.showRange) this.form.get('percentage').valueChanges.subscribe((value) => this.percentageChange(value));
    if (this.showRange) this.form.get('range').valueChanges.subscribe((value) => this.rangeChange(value));
  }

  private amountChange(value: number) {
    let patchValues = {};
    if (value > this.max) {
      patchValues = this.maxFormValues();
    } else {
      patchValues = {
        quoteAmount: this.parseAmount(value * this.quotePrice),
        percentage: Math.round((value * 100) / this.max),
        range: (value * 100) / this.max,
      };
    }
    this.form.patchValue(patchValues, this.defaultPatchValueOptions());
    // TODO: Agregar casos de send
    // if (this.isSend) {
    //   if (value > this.max) {
    //     this.form.patchValue(
    //       {
    //         quoteAmount: this.parseAmount(this.max * this.quotePrice),
    //         amount: this.max,
    //       },
    //       this.defaultPatchValueOptions()
    //     );
    //   }
    // }
  }

  private quoteAmountChange(value: number) {
    let patchValues = {};

    if (value > this.max * this.quotePrice) {
      patchValues = this.maxFormValues();
    } else {
      patchValues = {
        amount: value / this.quotePrice,
        percentage: Math.round(((value / this.quotePrice) * 100) / this.max),
        range: ((value / this.quotePrice) * 100) / this.max,
      };
    }

    this.form.patchValue(patchValues, this.defaultPatchValueOptions());
    // TODO: Agregar casos de send
    // if (this.isSend) {
    //   if (value > this.max * this.quotePrice) {
    //     this.form.patchValue(
    //       {
    //         quoteAmount: this.parseAmount(this.max * this.quotePrice),
    //         amount: this.max,
    //       },
    //       this.defaultPatchValueOptions()
    //     );
    //   }
    // }
  }
  percentageChange(value) {
    let patchValues = {};
    if (!value) value = 0;
    if (value > 100) {
      patchValues = this.maxFormValues();
    } else {
      patchValues = {
        quoteAmount: this.quoteAmount(value),
        range: value,
        amount: this.amount(value),
      };
    }
    this.form.patchValue(patchValues, this.defaultPatchValueOptions());
  }

  rangeChange(value) {
    this.form.patchValue(
      { percentage: value, amount: this.amount(value), quoteAmount: this.quoteAmount(value) },
      this.defaultPatchValueOptions()
    );
  }

  private parseAmount(value: number): string {
    let stringValue = value.toString();

    if (stringValue.includes('e')) {
      stringValue = parseFloat(stringValue).toFixed(20);
    }

    if (stringValue.includes('.')) {
      stringValue = stringValue.replace(/\.?0+$/, '');
    }

    return stringValue;
  }

  // private async balanceAvailable() {
  //   if (!this.showRange) {
  //     const balance = await this.walletBalance.balanceOf(this.baseCurrency);
  //     if (this.baseCurrency.native && this.nativeFee) {
  //       const nativeBalanceWithoutFee = balance - this.nativeFee;
  //       this.max = nativeBalanceWithoutFee > 0 ? nativeBalanceWithoutFee : 0;
  //     } else {
  //       this.max = balance;
  //     }
  //     this.setPrice(this.max);
  //   } else {
  //     this.max = this.investedAmount;
  //     this.setPrice(this.investedAmount);
  //   }
  //   console.log('this.available ', this.max);
  // }

  amount(value: number) {
    return (this.max * value) / 100;
  }

  quoteAmount(value: number) {
    return this.parseAmount(this.amount(value) * this.quotePrice);
  }

  setPrice() {
    this.quoteMax = this.max * this.quotePrice;
    this.isLoaderActive = false;
  }
}
