import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

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
        <ion-text class="ux-font-lato ux-fweight-semibold ux-fsize-15">=</ion-text>
        <app-ux-input-underlined
          [labelRight]="this.referenceCurrencyName"
          controlName="referenceAmount"
          debounce="1000"
          type="number"
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

  constructor(private formGroupDirective: FormGroupDirective) {}

  ngOnInit() {
    this.form = this.formGroupDirective.form;
    this.form.get('amount').valueChanges.subscribe((value) => this.amountChange(value));
  }

  private amountChange(value: number) {
    this.form.patchValue({ referenceAmount: this.referenceEquivalentOf(value) });
  }

  private referenceEquivalentOf(amount: number) {
    return amount; // TODO: request for price
  }
}
