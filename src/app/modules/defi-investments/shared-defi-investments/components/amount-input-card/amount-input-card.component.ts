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
    <div class="aic__available text-center">
          <ion-text class="ux-font-titulo-xs">
            {{ 'Saldo disponible' }}
          </ion-text>
          <ion-text class="ux-font-text-xl">
          {{ this.available | number: '1.2-6' }} {{ this.baseCurrency.value }}</ion-text
          >
          <ion-text *ngIf="this.usdPrice" class="ux-font-text-xxs">
          ≈ {{ this.usdPrice | number: '1.2-2' }} {{this.quoteCurrency}}
          </ion-text>
        </div>
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
          <ion-input class="aic__content__inputs__amount max" formControlName="amount" type="number" inputmode="numeric">
            <ion-button
              [disabled]="!this.usdPrice"
              (click)="this.setMax()"
              slot="end"
              fill="clear"
              size="small"
              class="ux-font-button"
              >{{ 'defi_investments.shared.amount_input_card.max_button' | translate }}</ion-button
            >
          </ion-input>
          <ion-text class="aic__content__equal ux-fweight-medium ">=</ion-text>
          <ion-input formControlName="quoteAmount" type="number" inputmode="numeric"></ion-input>
        </div>
        <div class="aic__content__disclaimer">
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
export class AmountInputCardComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @Input() baseCurrency: Coin;
  @Input() quoteCurrency = 'USD';
  available: number;
  feeCoin: string;
  private destroy$ = new Subject<void>();
  price: number;
  form: FormGroup;
  usdPrice : number;
  
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
    console.log('ejec')
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
    this.form.get('quoteAmount').valueChanges.subscribe((value) => this.quoteAmountChange(value));
  }

  private amountChange(value: number) {
    this.form.patchValue({ quoteAmount: this.parseAmount(value * this.price) }, { emitEvent: false, onlySelf: true });
  }

  private quoteAmountChange(value: number) {
    this.form.patchValue({ amount: this.parseAmount(value / this.price) }, { emitEvent: false, onlySelf: true });
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
    this.available = await this.walletBalance.balanceOf(this.baseCurrency);
    this.setPrice(this.available);
  }

  setPrice(available : number){
    this.usdPrice = (available * this.price);
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
