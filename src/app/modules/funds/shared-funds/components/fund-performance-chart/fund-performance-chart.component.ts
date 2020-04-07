import {
  Component,
  Input,
  OnChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  Chart,
  GridLineOptions,
  ChartScales,
  ChartTooltipOptions,
  ChartLayoutOptions,
} from 'chart.js';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-fund-performance-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fund_performance_chart">
      <canvas id="performance_chart"></canvas>
    </div>
  `,
  styleUrls: ['./fund-performance-chart.component.scss'],
})
export class FundPerformanceChartComponent implements OnChanges {
  @Input() fundPerformance: any;
  @Input() interval: string;

  chart: Chart;

  constructor(
    private datePipe: DatePipe,
    private translate: TranslateService
  ) {}

  gridLineOptions: GridLineOptions = {
    display: false,
    drawBorder: false,
    drawOnChartArea: true,
  };

  scalesOptions(): ChartScales {
    return {
      xAxes: [
        {
          ticks: {
            // autoSkip: true,
            maxRotation: 0,
            minRotation: 0,
            maxTicksLimit: 7,
            fontFamily: 'Lato',
            fontSize: 10,
            fontColor: '#FFFFFF',
            fontStyle: '800',
          },
          gridLines: this.gridLineOptions,
          offset: false,
        },
      ],
      yAxes: [
        {
          ticks: {
            min: -this.fundPerformance.stop_loss * 1.3, // Minima altura un 30 % mas abajo que el stop_loss
            max: this.fundPerformance.take_profit * 1.3, // Maxima altura un 30 % mas arriba que el take_profit
          },
          offset: false,
          display: false,
        },
      ],
    };
  }

  layoutOptions(): ChartLayoutOptions {
    return {
      padding: {
        left: 0,
        right: 72,
      },
    };
  }

  tooltipsOptions(): ChartTooltipOptions {
    return {
      enabled: true,
      mode: 'nearest',
      intersect: false,
      backgroundColor: '#FFFFFF',
      cornerRadius: 4,
      borderWidth: 0,
      bodyFontFamily: 'Gilroy',
      bodyFontStyle: '800',
      bodyFontSize: 10,
      displayColors: false,
      callbacks: {
        title: () => null,
        label: (tooltipItem) => {
          const value = parseFloat(tooltipItem.value) * 100;
          return `${value > 0 ? '+' : ''}${Math.round(value * 100) / 100}%`;
        },
        labelTextColor: () => '#FF9100',
      },
    };
  }

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
              label: 'Performance',
              data: this.fundPerformance.performance,
              borderColor: '#FFFFFF',
              borderWidth: 2,
              fill: true,
              pointRadius: 1,
            },
            {
              label: 'Take Profit',
              data: this.setTakeProfitData(),
              backgroundColor: '#FFFFFF',
              borderColor: '#FFFFFF4D',
              borderWidth: 1,
              fill: false,
              pointRadius: 0,
            },
            {
              label: 'Stop Loss',
              data: this.setStopLossData(),
              backgroundColor: '#FFFFFF',
              borderColor: '#FFFFFF4D',
              borderWidth: 1,
              fill: false,
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          legend: {
            display: false,
          },
          layout: this.layoutOptions(),
          scales: this.scalesOptions(),
          tooltips: this.tooltipsOptions(),
        },
      });
      this.setGradient();
    }
  }

  setStopLossData() {
    return new Array<number>(this.fundPerformance.performance.length).fill(
      -this.fundPerformance.stop_loss
    );
  }

  setTakeProfitData() {
    return new Array<number>(this.fundPerformance.performance.length).fill(
      this.fundPerformance.take_profit
    );
  }

  setGradient() {
    const context = this.chart.canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 1214);
    gradient.addColorStop(0.5, '#FFFFFF4D');
    gradient.addColorStop(1, '#FFFFFF');
    const newData = this.chart.data;
    newData.datasets[0].backgroundColor = gradient;
    this.chart.data = newData;
    this.chart.update();
  }

  normalizeLabels(): string[] {
    const pattern = this.getIntervalPattern(this.interval);
    return this.fundPerformance.dates.map((item: string) =>
      this.datePipe
        .transform(item, pattern, undefined, this.translate.currentLang)
        .toUpperCase()
    );
  }

  hasPerformanceData(): boolean {
    return (
      this.fundPerformance &&
      Array.isArray(this.fundPerformance.dates) &&
      this.fundPerformance.dates.length &&
      Array.isArray(this.fundPerformance.performance) &&
      this.fundPerformance.performance.length
    );
  }

  getIntervalPattern(interval: string): string {
    let pattern: string;
    switch (interval) {
      case '1d':
        pattern = 'EEEE';
        break;
      case '1w':
        pattern = 'EEE';
        break;
      case '30d':
        pattern = 'd/M';
        break;
      case 'all':
        pattern = 'd/M';
        break;

      default:
        pattern = 'd/M';
        break;
    }
    return pattern;
  }
}
