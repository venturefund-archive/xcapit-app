import { WalletBalanceService } from '../../../modules/wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { Subject } from 'rxjs';
import { Coin } from '../../../modules/wallets/shared-wallets/interfaces/coin.interface';
import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { takeUntil } from 'rxjs/operators';
import { DynamicPrice } from '../../models/dynamic-price/dynamic-price.model';

@Component({
  selector: 'app-amount-input-card',
  template: `
    <div class="aic ion-padding">
      <div class="aic__available text-center">
        <ion-text class="ux-font-titulo-xs">
          {{ this.header }}
        </ion-text>
        <div class="aic__available__amounts">
          <ion-text *ngIf="this.showRange" class="ux-font-text-xl">
            {{ this.investedAmount | number: '1.2-6' }} {{ this.baseCurrency.value }}</ion-text
          >
          <ion-text *ngIf="!this.showRange" class="ux-font-text-xl">
            {{ this.available | number: '1.2-6' }} {{ this.baseCurrency.value }}</ion-text
          >
          <ion-text *ngIf="this.investedAmount || this.available" class="ux-font-text-xxs">
            ≈ {{ this.usdPrice | number: '1.2-2' }} {{ this.quoteCurrency }}
          </ion-text>
        </div>
      </div>
      <div class="aic__content">
        <div class="aic__content__title">
          <ion-text class="ux-font-text-lg"> {{ this.label }}</ion-text>
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
            <!-- <ion-text>Monto de usuario aca</ion-text> -->
            <ion-input
              appNumberInput
              class="aic__content__inputs__amount_with_max__amount"
              formControlName="amount"
              type="number"
              inputmode="numeric"
            >
            </ion-input>
            <ion-button
              [disabled]="!this.usdPrice || (this.baseCurrency.native && !this.nativeFee)"
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
        <div *ngIf="!this.showRange" class="aic__content__disclaimer">
          <ion-text class="ux-font-text-xs" style="white-space: pre-wrap;"
            >{{ 'defi_investments.shared.amount_input_card.disclaimer' | translate }} {{ this.feeCoin }}.</ion-text
          >
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
export class AmountInputCardComponent implements OnInit, OnDestroy, OnChanges {
  @Input() label: string;
  @Input() header: string;
  @Input() investedAmount: number;
  @Input() baseCurrency: Coin;
  @Input() quoteCurrency = 'USD';
  @Input() showRange: boolean;
  @Input() priceRefreshInterval = 15000;
  @Input() nativeFee = 0;
  @Input() isSend = false;
  available: number;
  feeCoin: string;
  private destroy$ = new Subject<void>();
  price: number;
  form: FormGroup;
  usdPrice: number;

  constructor(
    private formGroupDirective: FormGroupDirective,
    private apiWalletService: ApiWalletService,
    private walletBalance: WalletBalanceService
  ) {}

  ngOnInit() {
    this.balanceAvailable();
    this.setFeeCoin();
    this.dynamicPrice();
    this.subscribeToFormChanges();
  }

  defaultPatchValueOptions() {
    return { emitEvent: false, onlySelf: true };
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes.nativeFee.currentValue) {
      const previousBalance = this.available;
      await this.balanceAvailable();
      if (this.form.value.amount === previousBalance) this.setMax();
    }
  }

  setMax() {
    this.form.get('amount').patchValue(this.available);
  }

  private dynamicPrice() {
    this.createDynamicPrice()
      .value()
      .pipe(takeUntil(this.destroy$))
      .subscribe((price: number) => (this.price = price));
  }

  createDynamicPrice(): DynamicPrice {
    return DynamicPrice.create(this.priceRefreshInterval, this.baseCurrency, this.apiWalletService);
  }

  subscribeToFormChanges() {
    this.form = this.formGroupDirective.form;
    const percentage = this.form.get('percentage');
    const range = this.form.get('range');
    this.form.get('amount').valueChanges.subscribe((value) => this.amountChange(value));
    this.form.get('quoteAmount').valueChanges.subscribe((value) => this.quoteAmountChange(value));
    if (percentage) percentage.valueChanges.subscribe((value) => this.percentageChange(value));
    if (range) range.valueChanges.subscribe((value) => this.rangeChange(value));
  }

  percentageChange(value) {
    if (!isNaN(value)) {
      if (value > 100) {
        this.form.patchValue(
          {
            percentage: 100,
            range: 100,
            quoteAmount: this.parseAmount(this.investedAmount * this.price),
            amount: this.investedAmount,
          },
          this.defaultPatchValueOptions()
        );
      } else {
        this.form.patchValue(
          { range: value, amount: this.amount(value), quoteAmount: this.quoteAmount(value) },
          this.defaultPatchValueOptions()
        );
      }
    }
  }

  rangeChange(value) {
    if (!isNaN(value)) {
      this.form.patchValue(
        { percentage: value, amount: this.amount(value), quoteAmount: this.quoteAmount(value) },
        this.defaultPatchValueOptions()
      );
    }
  }

  private amountChange(value: number) {
    if (value > this.investedAmount) {
      this.form.patchValue(
        {
          quoteAmount: this.parseAmount(this.investedAmount * this.price),
          percentage: 100,
          range: 100,
          amount: this.investedAmount,
        },
        this.defaultPatchValueOptions()
      );
    } else {
      this.form.patchValue(
        {
          quoteAmount: this.parseAmount(value * this.price),
          percentage: Math.round((value * 100) / this.investedAmount),
          range: (value * 100) / this.investedAmount,
        },
        this.defaultPatchValueOptions()
        );
    }
    if (this.isSend) {
      if (value > this.available) {
        this.form.patchValue(
          {
            quoteAmount: this.parseAmount(this.available * this.price),
            amount: this.available,
          },
          this.defaultPatchValueOptions()
        );
      }
    }
  }

  private quoteAmountChange(value: number) {
    if (value > this.investedAmount) {
      this.form.patchValue(
        {
          amount: this.investedAmount,
          percentage: 100,
          range: 100,
          quoteAmount: this.parseAmount(this.investedAmount * this.price),
        },
        this.defaultPatchValueOptions()
      );
    } else {
      this.form.patchValue(
        {
          amount: value / this.price,
          percentage: Math.round(((value / this.price) * 100) / this.investedAmount),
          range: ((value / this.price) * 100) / this.investedAmount,
        },
        this.defaultPatchValueOptions()
      );
    }
    if (this.isSend) {
      if (value > (this.available * this.price)) {
        this.form.patchValue(
          {
            quoteAmount: this.parseAmount(this.available * this.price),
            amount: this.available,
          },
          this.defaultPatchValueOptions()
        );
      }
    }
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

  private async balanceAvailable() {
    const balance = await this.walletBalance.balanceOf(this.baseCurrency);
    if (this.baseCurrency.native && this.nativeFee) {
      const nativeBalanceWithoutFee = balance - this.nativeFee;
      this.available = nativeBalanceWithoutFee > 0 ? nativeBalanceWithoutFee : 0;
    } else {
      this.available = balance;
    }

    if (!this.showRange) {
      this.setPrice(this.available);
    } else {
      this.setPrice(this.investedAmount);
    }
  }

  amount(value: number) {
    return (this.investedAmount * value) / 100;
  }

  quoteAmount(value: number) {
    return this.parseAmount(this.amount(value) * this.price);
  }

  setPrice(available: number) {
    this.usdPrice = available * this.price;
  }

  private setFeeCoin() {
    this.feeCoin = this.apiWalletService
      .getCoins()
      .find((coin) => coin.native && coin.network === this.baseCurrency.network).value;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
