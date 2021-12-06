import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { ApiWalletService } from '../../services/api-wallet/api-wallet.service';

@Component({
  selector: 'app-amount-input-card',
  template: `
    <div class="aic ion-padding">
      <div class="aic__header__title">
        <ion-text class="ux-font-lato ux-fweight-semibold ux-fsize-14">{{ this.title }}</ion-text>
      </div>
      <div class="aic__content">
        <app-ux-input-underlined
          [labelRight]="this.currencyName"
          controlName="amount"
          debounce="1000"
          type="number"
        ></app-ux-input-underlined>
        <ion-text class="ux-font-text-xs">=</ion-text>
        <app-ux-input-underlined
          [labelRight]="this.referenceCurrencyName"
          controlName="referenceAmount"
          debounce="1000"
          type="number"
          readonly="true"
          [loading]="this.loading"
        ></app-ux-input-underlined>
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
  form: FormGroup;
  loading = false;

  constructor(private formGroupDirective: FormGroupDirective, private apiWalletService: ApiWalletService) {}

  ngOnInit() {
    this.form = this.formGroupDirective.form;
    this.form.get('amount').valueChanges.subscribe((value) => this.amountChange(value));
  }

  private amountChange(value: number) {
    this.loading = true;
    this.apiWalletService.getPrices([this.base()], false).subscribe((res) => {
      this.form.patchValue({ referenceAmount: value * res.prices[this.base()] });
      this.loading = false;
    });
  }

  private base() {
    return this.currencyName === 'RBTC' ? 'BTC' : this.currencyName;
  }
}
