import { WalletBalanceService } from './../../../../wallets/shared-wallets/services/wallet-balance/wallet-balance.service';
import { interval, Subject, Subscription } from 'rxjs';
import { Coin } from './../../../../wallets/shared-wallets/interfaces/coin.interface';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { ApiWalletService } from 'src/app/modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { take, takeUntil } from 'rxjs/operators';
import { DynamicPrice } from '../../../../../shared/models/dynamic-price/dynamic-price.model';

@Component({
  selector: 'app-amount-input-card',
  template: `
    <div class="aic ion-padding">
      <div class="aic__header">
        <ion-text class="ux-font-titulo-xs">{{ this.title }}</ion-text>
      </div>
      <div class="aic__content">
        <div class="aic__content__label">
          <ion-text class="ux-font-text-xs aic__content__label__first" position="stacked">{{
            this.baseCurrency.value
          }}</ion-text>
          <ion-text class="ux-font-text-xs aic__content__label__second" position="stacked">{{
            this.quoteCurrency
          }}</ion-text>
        </div>
        <div class="aic__content__inputs">
          <ion-input class="aic__content__inputs__amount" formControlName="amount" type="number" inputmode="numeric" placeholder="0.000144">
            <ion-button
              [disabled]="!this.available"
              (click)="this.setMax()"
              slot="end"
              fill="clear"
              size="small"
              class="ux-font-button"
              >{{ 'defi_investments.shared.amount_input_card.max_button' | translate }}</ion-button
            >
          </ion-input>
          <ion-text class="aic__content__equal ux-fweight-medium ">=</ion-text>
          <ion-input
            class="read-only"
            formControlName="quoteAmount"
            type="number"
            inputmode="numeric"
            readonly
          ></ion-input>
        </div>
        <div class="aic__content__available">
          <ion-text class="ux-font-text-xxs">
            {{ 'defi_investments.shared.amount_input_card.available' | translate }}
            {{ this.available | number: '1.2-6' }} {{ this.baseCurrency.value }}</ion-text
          >
        </div>
        <div class="aic__content__disclaimer">
          <ion-text class="ux-font-text-xs">
            {{ 'defi_investments.shared.amount_input_card.disclaimer' | translate }} {{ this.feeCoin }}.</ion-text
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
export class AmountInputCardComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @Input() baseCurrency: Coin;
  @Input() quoteCurrency = 'USD';
  available: number;
  feeCoin: string;
  private destroy$ = new Subject<void>();
  price: number;
  form: FormGroup;
  @Input() priceRefreshInterval = 15000;

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
    this.form.get('amount').valueChanges.subscribe((value) => this.amountChange(value));
  }

  private amountChange(value: number) {
    this.form.patchValue({
      quoteAmount: this.parseQuoteAmount(value * this.price),
    });
  }

  private parseQuoteAmount(value: number): string {
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
    this.available = await this.walletBalance.balanceOf(this.baseCurrency);
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
