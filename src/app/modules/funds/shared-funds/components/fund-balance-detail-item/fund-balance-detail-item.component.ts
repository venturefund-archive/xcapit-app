import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fund-balance-detail-item',
  template: `
    <div class="fbdi">
      <div class="fbdi__left">
        <div class="color" [style.background-color]="item.color"></div>
        <div class="ca">
          <ion-text class="ux-font-text-xs" color="neutral90">{{ item.ca }}</ion-text>
        </div>
        <div class="amount">
          <ion-text class="ux-font-text-xs" color="neutral90">{{ item.amount | number: '1.6-8' }}</ion-text>
        </div>
      </div>
      <div class="fbdi__right">
        <div class="value">
          <ion-text class="ux-font-text-xs" color="neutral50">
            {{
              item.value
                | currencyFormat
                  : {
                      currency: this.currency,
                      formatUSDT: '1.6-6',
                      formatBTC: '1.6-6'
                    }
            }}
          </ion-text>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./fund-balance-detail-item.component.scss'],
})
export class FundBalanceDetailItemComponent implements OnInit {
  @Input() item: any;
  @Input() currency: string;

  constructor() {}

  ngOnInit() {}
}
