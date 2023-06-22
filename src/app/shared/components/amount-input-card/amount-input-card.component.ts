import { Coin } from '../../../modules/wallets/shared-wallets/interfaces/coin.interface';
import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { ControlContainer, UntypedFormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-amount-input-card',
  template: `
    <div class="aic ion-padding">
      <div [ngClass]="this.insufficientBalance ? 'aic__insufficient-funds' : 'aic__available'" class=" text-center">
        <ion-text class="ux-font-titulo-xs">
          {{ this.header }}
        </ion-text>
        <div [ngClass]="this.insufficientBalance ? 'aic__insufficient-funds__amounts' : 'aic__available__amounts'">
          <ion-text class="ux-font-text-xl" color="neutral80">
            {{ this.max | formattedAmount }} {{ this.baseCurrency.value }}</ion-text
          >
          <ion-text class="ux-font-text-xxs" color="neutral80">
            ≈ {{ this.quoteMax | formattedAmount : 10 : 2 }} {{ this.quoteCurrency }}
          </ion-text>
        </div>
      </div>
      <div class="aic__send">
        <ion-text class="ux-font-titulo-xs">
          {{ this.title }}
        </ion-text>
        <ion-button
          *ngIf="this.amountSend"
          class="ion-no-padding ion-no-margin"
          slot="icon-only"
          fill="clear"
          appTrackClick
          name="ux_phrase_information"
          size="small"
          (click)="this.showPhraseAmountInfo()"
        >
          <ion-icon name="information-circle"></ion-icon>
        </ion-button>
      </div>
      <div class="aic__content">
        <div class="aic__content__title" *ngIf="this.label">
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
        <div class="aic__content__inputs" [ngClass]="{ invalid: this.insufficientBalance || (!this.form.controls.amount.valid && this.warrantyValidators)}">
          <div class="aic__content__inputs__amount_with_max">
            <ion-input
              appNumberInput
              appCommaToDot
              class="aic__content__inputs__amount_with_max__amount"
              formControlName="amount"
              type="text"
              inputmode="decimal"
              debounce="500"
            >
            </ion-input>
            <ion-button
              (click)="this.setMaxAmount()"
              slot="end"
              fill="clear"
              size="small"
              class="aic__content__inputs__amount_with_max__max ux-font-button"
              >{{ 'defi_investments.shared.amount_input_card.max_button' | translate }}</ion-button
            >
          </div>
          <ion-text class="aic__content__equal ux-fweight-medium">=</ion-text>
          <ion-input
            appNumberInput
            appCommaToDot
            class="aic__content__inputs__quoteAmount"
            formControlName="quoteAmount"
            type="text"
            inputmode="decimal"
            debounce="500"
          ></ion-input>
        </div>
        <div class="aic__content__helpers">
          <ion-icon
            *ngIf="(!this.form.controls.amount.valid && this.form.controls.amount.touched)"
            color="dangerdark"
            icon="information-error"
          ></ion-icon>
          <ion-label
            class="ux-font-text-xxs"
            *ngIf="(!this.form.controls.amount.valid && this.form.controls.amount.touched)"
            > El monto minimo es de X USD
          </ion-label>
        </div>

        <div class="aic__content__funds-advice info " *ngIf="this.insufficientBalance">
          <img src="assets/img/defi-investments/shared/amount-input-card/exclamation.svg" />
          <ion-text class="ux-font-text-xxs">
            {{ 'defi_investments.shared.amount_input_card.advice' | translate }}
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
export class AmountInputCardComponent implements OnInit, OnChanges {
  @Input() baseCurrency: Coin;
  @Input() quoteCurrency = 'USD';
  @Input() quotePrice: number;
  @Input() label: string;
  @Input() header: string;
  @Input() title: string;
  @Input() disclaimer = true;
  @Input() max: number;
  @Input() showRange: boolean;
  @Input() feeToken: Coin;
  @Input() amountSend: boolean;
  @Input() warrantyValidators: boolean;
  @Output() phraseAmountInfoClicked: EventEmitter<void> = new EventEmitter<void>();

  isAmountSend: boolean;
  isInfoModalOpen = false;
  value: number;
  insufficientBalance: boolean;

  form: UntypedFormGroup;
  quoteMax: number;

  constructor(private formGroupDirective: FormGroupDirective) {}

  ngOnInit() {
    this.subscribeToFormChanges();
    this.setQuotePrice();
  }

  private defaultPatchValueOptions() {
    return { emitEvent: false, onlySelf: true };
  }

  async ngOnChanges(): Promise<void> {
    this.setQuotePrice();
  }

  setMaxAmount() {
    this.form.get('amount').patchValue(this.max);
  }

  private setMaxFormValues(): void {
    const maxValues = {
      quoteAmount: this.parseAmount(this.max * this.quotePrice),
      percentage: 100,
      range: 100,
      amount: this.max,
    };
    this.form.patchValue(maxValues, this.defaultPatchValueOptions());
  }

  showPhraseAmountInfo() {
    this.phraseAmountInfoClicked.emit();
  }

  private subscribeToFormChanges(): void {
    this.form = this.formGroupDirective.form;
    this.form.get('amount').valueChanges.subscribe((value) => {
      this.amountChange(value);
      this.value = value;
      this.insufficientBalance = this.value > this.max;
    });
    this.form.get('quoteAmount').valueChanges.subscribe((value) => {
      this.quoteAmountChange(value);
      this.value = value;

      this.insufficientBalance = this.value > this.quoteMax;
    });
    if (this.showRange) this.form.get('percentage').valueChanges.subscribe((value) => this.percentageChange(value));
    if (this.showRange) this.form.get('range').valueChanges.subscribe((value) => this.rangeChange(value));
  }

  private amountChange(value: number): void {
    if (value > this.max && this.showRange) {
      this.setMaxFormValues();
      return;
    }
    const newValues = {
      quoteAmount: this.parseAmount(value * this.quotePrice),
      percentage: Math.round((value * 100) / this.max),
      range: (value * 100) / this.max,
    };

    this.form.patchValue(newValues, this.defaultPatchValueOptions());
  }

  private quoteAmountChange(value: number): void {
    if (value > this.max * this.quotePrice && this.showRange) {
      this.setMaxFormValues();
      return;
    }
    const newValues = {
      amount: this.parseAmount(value / this.quotePrice),
      percentage: Math.round(((value / this.quotePrice) * 100) / this.max),
      range: ((value / this.quotePrice) * 100) / this.max,
    };
    this.form.patchValue(newValues, this.defaultPatchValueOptions());
  }

  private percentageChange(percentage: number): void {
    if (!percentage) percentage = 0;
    if (percentage > 100) {
      this.setMaxFormValues();
      return;
    }
    const newValues = {
      quoteAmount: this.quoteAmountOf(percentage),
      range: percentage,
      amount: this.amountOf(percentage),
      percentage: percentage,
    };

    this.form.patchValue(newValues, this.defaultPatchValueOptions());
  }

  private rangeChange(percentage: number): void {
    this.form.patchValue(
      { percentage: percentage, amount: this.amountOf(percentage), quoteAmount: this.quoteAmountOf(percentage) },
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

  private amountOf(percentage: number): number {
    return (this.max * percentage) / 100;
  }

  private quoteAmountOf(percentage: number): string {
    return this.parseAmount(this.amountOf(percentage) * this.quotePrice);
  }

  private setQuotePrice(): void {
    this.quoteMax = this.max * this.quotePrice;
  }
}
