import {
  Component,
  Input,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { Chart, GridLineOptions } from 'chart.js';
import { DatePipe } from '@angular/common';
import { Currency } from '../../enums/currency.enum';

@Component({
  selector: 'app-fund-performance-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fund_performance_chart">
      <h4 class="ion-text-center" *ngIf="this.fundPerformance">
        {{ 'funds.fund_summary.chart_title' | translate }}
        {{ this.fundPerformance.fecha_fin | date: 'dd/MM/yyyy' }}
      </h4>
      <canvas id="performance_chart"></canvas>
    </div>
  `,
  styleUrls: ['./fund-performance-chart.component.scss']
})
export class FundPerformanceChartComponent implements OnChanges {
  @Input()
  fundPerformance: any;

  @Input()
  currency: string;

  chart: Chart;

  gridLineOptions: GridLineOptions = {
    display: true,
    drawBorder: true,
    drawOnChartArea: true
  };

  constructor(private datePipe: DatePipe) {}

  ngOnChanges() {
      this.setChart();
  }

  setChart() {
    if (this.hasPerformanceData()) {
      this.chart = new Chart('performance_chart', {
        type: 'line',
        data: {
          labels: this.normalizeLabels(),
          datasets: [
            {
              label: 'WCS Advisor',
              data: this.fundPerformance.wcs_advisor,
              backgroundColor: '#fed136',
              borderColor: '#fed136',
              fill: false
            },
            {
              label: this.getUsdLabel(),
              data: this.fundPerformance.usd,
              backgroundColor: 'green',
              borderColor: 'green',
              fill: false
            }
          ]
        },
        options: {
          scales: {
            xAxes: [
              {
                gridLines: this.gridLineOptions
              }
            ],
            yAxes: [
              {
                gridLines: this.gridLineOptions
              }
            ]
          }
        }
      });
    }
  }

  getUsdLabel(): string {
    return this.currency === Currency.USD ? Currency.USDT : Currency.BTC;
  }

  normalizeLabels(): string[] {
    return this.fundPerformance.index.map((item: string) =>
      this.datePipe.transform(item, 'dd/MM/yyyy')
    );
  }

  hasPerformanceData(): boolean {
    return (
      this.fundPerformance &&
      Array.isArray(this.fundPerformance.index) &&
      this.fundPerformance.index.length &&
      Array.isArray(this.fundPerformance.wcs_advisor) &&
      this.fundPerformance.wcs_advisor.length &&
      Array.isArray(this.fundPerformance.usd) &&
      this.fundPerformance.usd.length
    );
  }
}
