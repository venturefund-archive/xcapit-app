import { ModalController } from '@ionic/angular';
import { Component, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { createChart } from 'lightweight-charts';
import { HostListener } from '@angular/core';
import { FundShareChartComponent } from '../fund-share-chart/fund-share-chart.component';
import * as moment from 'moment';

@Component({
  selector: 'app-fund-performance-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fund_performance_chart">
      <div id="chart" class="fund_performance_chart__chart">
        <div id="tooltip" class="fund_performance_chart__chart__tooltip"></div>
      </div>
    </div>
    <div class="share_fund_chart" *ngIf="this.shareChart">
      <ion-button (click)="this.openShareDrawer()" expand="block" fill="clear">
        <ion-icon slot="end" name="ux-share"></ion-icon>
      </ion-button>
    </div>
  `,
  styleUrls: ['./fund-performance-chart.component.scss'],
})
export class FundPerformanceChartComponent implements OnChanges {
  @Input() fundPercentageEvolution: any;
  @Input() interval: string;
  @Input() isChart: boolean;
  @Input() shareChart = false;

  chart: any;
  limit: string;
  screenshot: any;

  constructor(private modalController: ModalController) {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.chart.resize(event.target.innerWidth * 0.8, event.target.innerHeight * 0.3);
  }

  ngOnChanges() {
    this.createChart();
  }

  createChart() {
    if (!this.chart) {
      const width = window.innerWidth * 0.8;
      let height = window.innerHeight * 0.4;
      const div = document.getElementById('chart');
      const dataSet = this.createDataSet();

      if (height > 300) {
        height = 300;
      } else if (height < 200) {
        height = 200;
      }

      this.chart = createChart(div, {
        width,
        height,
        localization: {
          dateFormat: 'dd/MM/yyyy',
          priceFormatter: (price) => price.toFixed(2) + '%',
        },
        layout: {
          backgroundColor: '#FFFFFF',
          textColor: 'rgba(0, 0, 0, 0.9)',
        },
        grid: {
          vertLines: {
            color: 'rgba(0, 0, 0, 0.5)',
            visible: false,
          },
          horzLines: {
            color: 'rgba(0, 0, 0, 0.5)',
            visible: false,
          },
        },
        crosshair: {
          vertLine: {
            color: 'rgba(0, 0, 0, 0.5)',
          },
          horzLine: {
            color: 'rgba(0, 0, 0, 0.5)',
          },
        },
        rightPriceScale: {
          visible: false,
        },
        leftPriceScale: {
          visible: true,
          borderColor: 'rgba(0, 0, 0, 0.8)',
        },
        timeScale: {
          borderColor: 'rgba(0, 0, 0, 0.8)',
          timeVisible: this.interval == '1d' ? true : false,
          secondsVisible: false,
          tickMarkFormatter: (time, tickMarkType, locale) => {
            const date = moment(time * 1000).utc();
            if (this.interval == '1d') {
              const minutes = date.minute() <= 9 ? '0' + date.minute() : date.minute();
              const hours = date.hour() <= 9 ? '0' + date.hour() : date.hour();
              return hours + ':' + minutes;
            } else {
              if (tickMarkType == 0) {
                return date.year();
              } else if (tickMarkType == 1) {
                const month = date.format('MMM').toLocaleString();
                return month;
              } else {
                return date.date() + '/' + (date.month() + 1);
              }
            }
          },
        },
      });
      const areaSeries = this.chart.addAreaSeries({
        lineColor: '#FF9100',
        topColor: '#FF9100',
        bottomColor: '#FFFFFF',
      });
      areaSeries.setData(dataSet);

      this.setXAxisRange();
      this.setTooltip(areaSeries);
    }
  }

  createDataSet() {
    const dataSet = [];
    let i;
    let time;
    let value;
    let date;
    for (i = 0; i < this.fundPercentageEvolution.percentage_evolution.length; i++) {
      if (i != this.fundPercentageEvolution.percentage_evolution.length - 2) {
        date = moment(this.fundPercentageEvolution.timestamp[i]);
        (time = moment(
          Date.UTC(date.year(), date.month(), date.date(), date.hour(), date.minute(), date.second(), 0)
        ).unix()),
          (value = this.fundPercentageEvolution.percentage_evolution[i]);
        dataSet.push({ time, value });
      }
    }
    return dataSet;
  }

  setXAxisRange() {
    const dateFrom = new Date(this.fundPercentageEvolution.timestamp[0]);
    const dateTo = new Date(this.fundPercentageEvolution.timestamp[this.fundPercentageEvolution.timestamp.length - 1]);
    this.chart.timeScale().setVisibleRange({
      from: moment(dateFrom).unix(),
      to: moment(dateTo).unix(),
    });
  }

  setTooltip(areaSeries) {
    const div = document.getElementById('chart');
    const toolTip = document.getElementById('tooltip');
    div.appendChild(toolTip);

    this.chart.subscribeCrosshairMove(function (param) {
      if (
        point_is_undefined(param) ||
        time_is_not_exists(param) ||
        x_point_is_less_than_zero(param) ||
        x_point_is_grather_than_clientWidth(param, div) ||
        y_point_is_less_than_zero(param) ||
        y_point_is_grather_than_clientHeight(param, div)
      ) {
        toolTip.style.display = 'none';
      } else {
        toolTip.style.display = 'block';
        const price = param.seriesPrices.get(areaSeries);
        toolTip.innerHTML = '<div>' + Math.round(100 * price) / 100 + '%</div>';

        const coordinateX = param.point.x + window.innerWidth * 0.05;
        const coordinateY = param.point.y + window.innerHeight * 0.24 + 50000 / window.innerHeight;
        toolTip.style.left = coordinateX + 'px';
        toolTip.style.top = coordinateY + 'px';
      }
    });

    function point_is_undefined(param) {
      return param.point === undefined;
    }

    function time_is_not_exists(param) {
      return !param.time;
    }

    function x_point_is_less_than_zero(param) {
      return param.point.x < 0;
    }

    function x_point_is_grather_than_clientWidth(param, div) {
      return param.point.x > div.clientWidth;
    }

    function y_point_is_less_than_zero(param) {
      return param.point.y < 0;
    }

    function y_point_is_grather_than_clientHeight(param, div) {
      return param.point.y > div.clientHeight;
    }
  }

  createLimitDataSet(): any[] {
    const lastPerformanceValue = this.fundPercentageEvolution.percentage_evolution[
      this.fundPercentageEvolution.percentage_evolution.length - 1
    ];
    let limitDataSet;
    if (Math.abs(this.fundPercentageEvolution.take_profit - lastPerformanceValue) <= 5) {
      limitDataSet = this.getLimitDataSet(this.fundPercentageEvolution.take_profit);
      this.limit = 'take_profit';
    }

    if (Math.abs(-this.fundPercentageEvolution.stop_loss - lastPerformanceValue) <= 5) {
      limitDataSet = this.getLimitDataSet(-this.fundPercentageEvolution.stop_loss);
      this.limit = 'stop_loss';
    }
    return limitDataSet;
  }

  getLimitDataSet(limit): any[] {
    const dataSet = [];
    let i;
    let time;
    let value;
    for (i = 0; i < this.fundPercentageEvolution.timestamp.length; i++) {
      if (i != this.fundPercentageEvolution.timestamp.length - 2) {
        (time = moment(this.fundPercentageEvolution.timestamp[i]).unix()), (value = limit);
        dataSet.push({ time, value });
      }
    }
    return dataSet;
  }

  async openShareDrawer() {
    this.screenshot = this.chart.takeScreenshot();
    const modal = await this.modalController.create({
      component: FundShareChartComponent,
      componentProps: {
        screenshot: this.screenshot.toDataURL(),
      },
      swipeToClose: false,
      cssClass: 'ux-routeroutlet-modal share-chart-modal',
    });

    await modal.present();
  }
}
