import { LanguageService } from './../../../../../shared/services/language/language.service';
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
  @Input() fundPercentageEvolution: any;
  @Input() interval: string;

  chart: Chart;

  constructor(
    private datePipe: DatePipe,
    private languageService: LanguageService
  ) {}

  gridLineOptions: GridLineOptions = {
    display: false,
    drawBorder: false,
    drawOnChartArea: true,
  };

  parsePercentageToFloat(percentage) {
    return parseFloat(`0.${percentage.toString()}`);
  }

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
            beginAtZero: true
          },
          // ticks: {
          //   min: -this.fundPercentageEvolution.stop_loss * 1.1, // 30 % minus than stop_loss
          //   max: this.fundPercentageEvolution.take_profit * 1.1, // 30 % more than take_profit
          // },
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
        top: 10
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
      filter: (tooltipItem) => {
        return tooltipItem.datasetIndex === 0 ||
          tooltipItem.datasetIndex === 1 ||
          tooltipItem.datasetIndex === 3;
      },
      callbacks: {
        title: () => null,
        label: (tooltipItem) => {
          const value = parseFloat(tooltipItem.value);
          return `${value > 0 ? '+' : ''}${Math.round(value * 100) / 100}%`;
        },
        labelTextColor: () => '#FF9100',
      },
    };
  }

  ngOnChanges() {
    this.setChart();
  }

  getPerformanceDataset() {
    return {
      label: 'Performance',
        data: this.fundPercentageEvolution.percentage_evolution,
      borderColor: '#FFFFFF',
      borderWidth: 2,
      fill: true,
      pointRadius: 1,
    };
  }

  getTakeProfitDataset() {
    return [
      {
      label: 'Take Profit',
      data: this.setTakeProfitData(),
      backgroundColor: '#FFFFFF',
      borderColor: '#FFFFFF4D',
      borderWidth: 1,
      fill: false,
      pointRadius: 0,
    }, {
      label: 'Take Profit',
      data: this.setTakeProfitPointData(),
      backgroundColor: '#21DD62',
      borderColor: '#FFFFFF',
      borderWidth: 1,
      fill: false,
      pointRadius: 5,
      showLine: false,
      tooltip: false,
      hoverRadius: 0
    }
    ];
  }

  getStopLossDataset() {
    return [{
      label: 'Stop Loss',
      data: this.setStopLossData(),
      backgroundColor: '#FFFFFF',
      borderColor: '#FFFFFF4D',
      borderWidth: 1,
      fill: false,
      pointRadius: 0,
    }, {
      label: 'Stop Loss',
      data: this.setStopLossPointData(),
      backgroundColor: '#ef170e',
      borderColor: '#FFFFFF',
      borderWidth: 1,
      fill: false,
      pointRadius: 5,
      showLine: false,
      hoverRadius: 0
    }
    ];
  }

  getDatasets() {
    let datasets: any[] = [this.getPerformanceDataset()];
    const lastPerformanceValue = this.fundPercentageEvolution.percentage_evolution[
    this.fundPercentageEvolution.percentage_evolution.length - 1];

    if ((this.fundPercentageEvolution.take_profit <= 5) || (lastPerformanceValue >= (this.fundPercentageEvolution.take_profit - 5))) {
      datasets = datasets.concat(this.getTakeProfitDataset());
    }

    if ((this.fundPercentageEvolution.stop_loss <= 5) || (lastPerformanceValue <= (-this.fundPercentageEvolution.stop_loss + 5))) {
      datasets = datasets.concat(this.getStopLossDataset());
    }
    return datasets;
  }

  setChart() {
    if (this.hasPerformanceData()) {
      this.chart = new Chart('performance_chart', {
        type: 'line',
        data: {
          labels: this.normalizeLabels(),
          datasets: this.getDatasets(),
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
    return new Array<number>(this.fundPercentageEvolution.percentage_evolution.length).fill(
      -parseFloat(this.fundPercentageEvolution.stop_loss)
    );
  }

  setTakeProfitData() {
    return new Array<number>(this.fundPercentageEvolution.percentage_evolution.length).fill(
      parseFloat(this.fundPercentageEvolution.take_profit)
    );
  }

  setStopLossPointData() {
    const emptyArray = new Array<number>(this.fundPercentageEvolution.percentage_evolution.length).fill(
      null
    );
    emptyArray[emptyArray.length - 1] = -parseFloat(this.fundPercentageEvolution.stop_loss);
    return emptyArray;
  }

  setTakeProfitPointData() {
    const emptyArray = new Array<number>(this.fundPercentageEvolution.percentage_evolution.length).fill(
      null
    );
    emptyArray[emptyArray.length - 1] = parseFloat(this.fundPercentageEvolution.take_profit);
    return emptyArray;
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
    return this.fundPercentageEvolution.timestamp.map((item: string) =>
      this.datePipe
        .transform(item, pattern, undefined, this.languageService.selected)
        .toUpperCase()
    );
  }

  hasPerformanceData(): boolean {
    return (
      this.fundPercentageEvolution &&
      Array.isArray(this.fundPercentageEvolution.timestamp) &&
      this.fundPercentageEvolution.timestamp.length &&
      Array.isArray(this.fundPercentageEvolution.percentage_evolution) &&
      this.fundPercentageEvolution.percentage_evolution.length
    );
  }

  getIntervalPattern(interval: string): string {
    let pattern: string;
    switch (interval) {
      case '1d':
        pattern = 'hh:mm';
        break;
      case '7d':
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
