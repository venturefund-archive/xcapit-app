import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { ApiWalletService } from '../../services/api-wallet/api-wallet.service';

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
            this.currencyName
          }}</ion-text>
          <ion-text class="ux-font-text-xs aic__content__label__second" position="stacked">{{
            referenceCurrencyName
          }}</ion-text>
        </div>
        <div class="aic__content__input">
          <ion-input controlName="amount" type="number" placeholder="0.000144"></ion-input>
          <ion-text class="aic__content__equal ux-fweight-medium ">=</ion-text>
          <ion-input controlName="referenceAmount" type="number"></ion-input>
        </div>
        <div class="aic__content__available">
          <ion-text class="ux-font-text-xxs"> Disponible {{ this.available }} {{ this.currencyName }}</ion-text>
        </div>
        <div class="aic__content__disclaimer">
          <ion-text class="ux-font-text-xs">
            Ten en cuenta que se cobrarán tarifas de transacción en {{ this.feeCoin }}.</ion-text
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
export class AmountInputCardComponent implements OnInit {
  @Input() title: string;
  @Input() currencyName: string;
  @Input() referenceCurrencyName: string;
  @Input() available: number;
  @Input() feeCoin: string;
  loading = false;
  form: FormGroup;
  constructor(private formGroupDirective: FormGroupDirective, private apiWalletService: ApiWalletService) {}

  ngOnInit() {
    this.title = 'Monto a invertir';
    this.currencyName = 'USDC';
    this.referenceCurrencyName = 'USD';
    this.available = 0.5786;
    this.feeCoin = 'MATIC';

    this.form = this.formGroupDirective.form;
    this.form.get('amount').valueChanges.subscribe((value) => this.amountChange(value));
  }

  private amountChange(value: number) {
    this.loading = true;
    this.apiWalletService.getPrices([this.currencyName], false).subscribe((res) => {
      this.form.patchValue({ referenceAmount: value * res.prices[this.currencyName] });
      this.loading = false;
    });
  }
}
