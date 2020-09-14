import {
  Component,
  Input,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { Chart, GridLineOptions } from 'chart.js';
import { DatePipe } from '@angular/common';
import { Currency } from 'src/app/modules/funds/shared-funds/enums/currency.enum';

@Component({
  selector: 'app-run-performance-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="run_performance_chart">
      <h4 class="ion-text-center" *ngIf="this.runPerformance">
        {{ 'runs.run_summary.chart_title' | translate }}
        {{ this.runPerformance.fecha_fin | date: 'dd/MM/yyyy' }}
      </h4>
      <canvas id="run_performance_chart"></canvas>
    </div>
  `,
  styleUrls: ['./run-performance-chart.component.scss']
})
export class RunPerformanceChartComponent implements OnChanges {
  @Input()
  runPerformance: any;

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
      this.chart = new Chart('run_performance_chart', {
        type: 'line',
        data: {
          labels: this.normalizeLabels(),
          datasets: [
            {
              label: 'WCS Advisor',
              data: this.runPerformance.wcs_advisor,
              backgroundColor: '#fed136',
              borderColor: '#fed136',
              fill: false
            },
            {
              label: this.currency,
              data: this.getDataForCurrencyToOptimize(),
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

  getDataForCurrencyToOptimize() {
    return this.currency === Currency.BTC
      ? this.runPerformance.performance_btc
      : this.runPerformance.performance_usdt;
  }

  normalizeLabels(): string[] {
    return this.runPerformance.index.map((item: string) =>
      this.datePipe.transform(item, 'dd/MM/yyyy')
    );
  }

  hasPerformanceData(): boolean {
    return (
      this.runPerformance &&
      Array.isArray(this.runPerformance.index) &&
      this.runPerformance.index.length &&
      Array.isArray(this.runPerformance.wcs_advisor) &&
      this.runPerformance.wcs_advisor.length &&
      this.checkPerformanceDataForCurrency()
    );
  }

  checkPerformanceDataForCurrency() {
    if (this.currency === Currency.BTC) {
      return (
        Array.isArray(this.runPerformance.performance_btc) &&
        this.runPerformance.performance_btc.length
      );
    }
    return (
      Array.isArray(this.runPerformance.performance_usdt) &&
      this.runPerformance.performance_usdt.length
    );
  }
}
