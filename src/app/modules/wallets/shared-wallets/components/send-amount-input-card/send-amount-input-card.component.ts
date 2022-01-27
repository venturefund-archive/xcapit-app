import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { ApiWalletService } from '../../services/api-wallet/api-wallet.service';

@Component({
  selector: 'app-send-amount-input-card',
  template: `
    <div class="saic ion-padding">
      <div class="saic__header__title">
        <ion-text class="ux-font-lato ux-fweight-semibold ux-fsize-14">{{ this.title }}</ion-text>
      </div>
      <div class="saic__content">
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
      <div class="saic__fee">
        <div class="saic__fee__title">
          <ion-text class="ux-font-title-xs">
            {{ 'wallets.send.send_detail.amount_input.fee_title' | translate }}
          </ion-text>
        </div>
        <div class="saic__fee__text">
          <ion-text class="ux-font-text-xxs">
            {{ 'wallets.send.send_detail.amount_input.fee_text' | translate }}
          </ion-text>
        </div>
        <div class="saic__fee__fee">
          <ion-text class="saic__fee__fee__amount ux-font-text-base">{{ this.fee + ' ' + this.currencyName }}</ion-text>
          <ion-text class="saic__fee__fee__reference_amount ux-font-text-base">{{
            this.referenceFee + ' ' + this.referenceCurrencyName
          }}</ion-text>
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
  styleUrls: ['./send-amount-input-card.component.scss'],
})
export class SendAmountInputCardComponent implements OnInit {
  @Input() title: string;
  @Input() currencyName: string;
  @Input() referenceCurrencyName: string;
  fee: string;
  referenceFee: string;
  form: FormGroup;
  loading = false;

  constructor(private formGroupDirective: FormGroupDirective, private apiWalletService: ApiWalletService) {}

  ngOnInit() {
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
