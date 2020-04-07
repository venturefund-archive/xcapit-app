import { Component, OnInit, Input } from '@angular/core';
import { FundPerformanceChartInterface } from './fund-performance-chart.interface';

@Component({
  selector: 'app-performance-chart-card',
  template: `
    <div class="fpcc">
      <app-fund-performance-chart
        *ngIf="this.fundPerformance"
        [fundPerformance]="this.fundPerformance"
        [interval]="interval"
      ></app-fund-performance-chart>
    </div>
  `,
  styleUrls: ['./performance-chart-card.component.scss'],
})
export class PerformanceChartCardComponent implements OnInit {
  @Input() fundPerformance: FundPerformanceChartInterface;
  @Input() interval: string;

  constructor() {}

  ngOnInit() {}
}
