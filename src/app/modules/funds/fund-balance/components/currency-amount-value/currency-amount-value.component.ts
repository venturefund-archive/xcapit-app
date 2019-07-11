import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-currency-amount-value',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      {{ 'funds.fund_balance.currency_amount_value.amount_text' | translate }}
      {{ this.amount | number: '1.2-4' }}
      {{ this.value ? ' / ' : '' }}
      {{ this.value | number: '1.2-2' }}
      {{ this.value ? ' USD' : '' }}
    </div>
  `,
  styleUrls: ['./currency-amount-value.component.scss']
})
export class CurrencyAmountValueComponent {
  @Input()
  amount: number;

  @Input()
  value: number;
}
