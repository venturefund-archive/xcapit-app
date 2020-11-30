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
import { createChart } from 'lightweight-charts';
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-fund-performance-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <div class="fund_performance_chart">
          <div id="chart" class="fund_performance_chart__chart"></div>
      </div>
  `,
  styleUrls: ['./fund-performance-chart.component.scss'],
})
export class FundPerformanceChartComponent implements OnChanges {
  @Input() fundPercentageEvolution: any;
  @Input() interval: string;

  chart: any;
  limit: string;

  constructor(
    private datePipe: DatePipe,
    private languageService: LanguageService
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.chart.resize(event.target.innerWidth * 0.8, event.target.innerHeight * 0.3);
  }

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
    //this.setChart();
    this.createChart();
  }

  createChart() {
    const width = window.innerWidth * 0.8;
    const height = 300;
    const div = document.getElementById('chart');
    const dataSet = this.createDataSet();
    const limitDataSet = this.createLimitDataSet();
    this.chart = createChart(div, {
      width: width,
      height: height,
      localization: {
        dateFormat: 'dd/MM/yyyy',
      },
      layout: {
		    backgroundColor: '#FF9100',
		    textColor: 'rgba(255, 255, 255, 0.9)',
	    },
	    grid: {
		    vertLines: {
			    color: 'rgba(255, 255, 255, 0.5)',
			    visible: false
		    },
		    horzLines: {
			    color: 'rgba(255, 255, 255, 0.5)',
			    visible: false
		    },
	    },
      crosshair: {
        vertLine: {
          color: 'rgba(255, 255, 255, 0.5)',
        },
        horzLine: {
          color: 'rgba(255, 255, 255, 0.5)',
        }
      },
	    rightPriceScale: {
		    borderColor: 'rgba(255, 255, 255, 0.8)',
	    },
	    timeScale: {
		    borderColor: 'rgba(255, 255, 255, 0.8)',
		    timeVisible: this.interval == '1d' ? true : false,
        secondsVisible: false,
	    },
	  });

	  if (limitDataSet) {
      const lineSeries = this.chart.addLineSeries({
        color: this.limit == "take_profit" ? '#00FF04' : '#FF0000'
      });
      lineSeries.setData(limitDataSet);
    }

    const areaSeries = this.chart.addAreaSeries({
      lineColor: '#FFFFFF',
      topColor: '#FFFFFF',
      bottomColor: '#FF9100'
    });
    areaSeries.setData(dataSet);

    this.setXAxisRange()
  }

  createDataSet() {
    let dataSet = [];
    let i;
    let time;
    let value;
    let date;
    for (i = 0; i < this.fundPercentageEvolution.percentage_evolution.length ; i++) {
      if (i != this.fundPercentageEvolution.percentage_evolution.length - 2) {
        date = new Date(this.fundPercentageEvolution.timestamp[i])
        time = (new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0))).getTime() / 1000,
        value = this.fundPercentageEvolution.percentage_evolution[i];
        dataSet.push({time: time, value: value})
      }
    }
    return dataSet;
  }

  setXAxisRange() {
    let dateFrom = new Date(this.fundPercentageEvolution.timestamp[0]);
    let dateTo = new Date(this.fundPercentageEvolution.timestamp[this.fundPercentageEvolution.timestamp.length - 1]);
    this.chart.timeScale().setVisibleRange({
      from: (new Date(Date.UTC(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate(), dateFrom.getHours(), dateFrom.getMinutes(), dateFrom.getSeconds(), 0))).getTime() / 1000,
      to: (new Date(Date.UTC(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), dateFrom.getHours(), dateFrom.getMinutes(), dateFrom.getSeconds(), 0))).getTime() / 1000,
    });
  }

  createLimitDataSet(): any[] {
    const lastPerformanceValue = this.fundPercentageEvolution.percentage_evolution[this.fundPercentageEvolution.percentage_evolution.length - 1];
    let limitDataSet;
    if (Math.abs(this.fundPercentageEvolution.take_profit - lastPerformanceValue) <= 5) {
      limitDataSet = this.getLimitDataSet(this.fundPercentageEvolution.take_profit);
      this.limit = "take_profit";
    }

    if (Math.abs(- this.fundPercentageEvolution.stop_loss - lastPerformanceValue) <= 5) {
      limitDataSet = this.getLimitDataSet(-this.fundPercentageEvolution.stop_loss);
      this.limit = "stop_loss";
    }
    return limitDataSet;
  }

  getLimitDataSet(limit): any[] {
    let dataSet = [];
    let i;
    let time;
    let value;
    let date;
    for (i = 0; i < this.fundPercentageEvolution.timestamp.length ; i++) {
      if (i != this.fundPercentageEvolution.timestamp.length - 2) {
        date = new Date(this.fundPercentageEvolution.timestamp[i])
        time = (new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0))).getTime() / 1000,
        value = limit;
        dataSet.push({time: time, value: value})
      }
    }
    return dataSet;
  }
}
