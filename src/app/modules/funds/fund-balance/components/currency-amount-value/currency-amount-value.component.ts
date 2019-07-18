import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Currency } from '../../../shared-funds/enums/currency.enum';

@Component({
  selector: 'app-currency-amount-value',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      {{ 'funds.fund_balance.currency_amount_value.amount_text' | translate }}
      {{ this.amount | number: '1.2-4' }}
      {{ ' / ' }}
      {{
        (this.currency === this.currencyEnum.BTC
          ? this.btcValue
          : this.usdValue) | number: '1.2-6'
      }}
      {{ ' ' }} {{ this.currency | currencyText }}
    </div>
  `,
  styleUrls: ['./currency-amount-value.component.scss']
})
export class CurrencyAmountValueComponent {
  @Input()
  amount: number;

  @Input()
  btcValue: number;

  @Input()
  usdValue: number;

  @Input()
  currency: string;

  currencyEnum = Currency;
}
