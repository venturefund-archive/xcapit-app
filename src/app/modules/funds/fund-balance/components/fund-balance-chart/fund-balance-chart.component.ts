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

  labels: string[];

  data: number[];

  constructor() {}

  ngOnChanges() {
    this.labels = [];
    this.data = [];
    this.setChart();
  }

  setChart() {
    if (this.hasBalanceData()) {
      this.setChartData();
      this.chart = new Chart('balance_chart', {
        type: 'pie',
        data: {
          labels: this.labels,
          datasets: [
            {
              data: this.data,
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

  setChartData() {
    for (const item of this.fundBalance.summary) {
      this.labels = [...this.labels, item.ca];
      this.data = [...this.data, item.amount];
    }
  }
}
