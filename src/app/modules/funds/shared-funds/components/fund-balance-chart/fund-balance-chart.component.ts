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
  data: number[];
  colors: string[];
  labels: string[];

  constructor() {}

  ngOnChanges() {
    this.colors = [];
    this.data = [];
    this.labels = [];
    this.setChart();
  }

  setChart() {
    if (this.hasBalanceData()) {
      this.setChartData();
      this.chart = new Chart('balance_chart', {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: this.data,
              backgroundColor: this.colors
            }
          ],
          labels: this.labels
        },
        options: {
          legend: {
            display: false
          },
          tooltips: {
            enabled: false
          },
          cutoutPercentage: 70,
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 1
        }
      });
    }
  }

  hasBalanceData(): boolean {
    return this.fundBalance && typeof this.fundBalance === 'object';
  }

  setChartData() {
    for (const item of this.fundBalance) {
      this.colors = [...this.colors, item.color];
      this.data = [...this.data, item.percentage];
      this.labels = [...this.labels, item.ca];
    }
  }
}
