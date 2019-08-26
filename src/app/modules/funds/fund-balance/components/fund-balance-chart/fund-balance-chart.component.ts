import {
  Component,
  OnChanges,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-fund-balance-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fund_balance_chart">
      <canvas id="balance_chart"></canvas>
    </div>
  `,
  styleUrls: ['./fund-balance-chart.component.scss']
})
export class FundBalanceChartComponent implements OnChanges {
  @Input()
  currency: string;

  @Input()
  fundBalance: any;

  chart: Chart;

  constructor() {}

  ngOnChanges() {
    this.setChart();
  }

  setChart() {
    if (this.hasBalanceData()) {
      this.chart = new Chart('balance_chart', {
        type: 'pie',
        data: {
          labels: ['BTC', 'ETH', 'LTC', 'BNB', 'USDT'],
          datasets: [
            {
              data: [
                this.fundBalance.btc_usd,
                this.fundBalance.eth_usd,
                this.fundBalance.ltc_usd,
                this.fundBalance.bnb_usd,
                this.fundBalance.cant_usdt
              ],
              backgroundColor: ['orange', 'grey', 'pink', 'yellow', 'green']
            }
          ]
        }
      });
    }
  }

  hasBalanceData(): boolean {
    return this.fundBalance && typeof this.fundBalance === 'object';
  }
}
