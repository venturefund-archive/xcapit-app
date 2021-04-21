import { Component, OnInit, Input } from '@angular/core';
import { FundPercentageEvolutionChartInterface } from './fund-performance-chart.interface';

@Component({
  selector: 'app-performance-chart-card',
  template: `
    <div class="fpcc" [ngClass]="{ loading: !this.fundPercentageEvolution }">
      <app-fund-performance-chart
        *ngIf="this.fundPercentageEvolution"
        [fundPercentageEvolution]="this.fundPercentageEvolution"
        [interval]="interval"
        [shareChart]="shareChart"
        [isChart]="isChart"
      ></app-fund-performance-chart>
      <app-ux-loading-block
        *ngIf="!this.fundPercentageEvolution"
        minSize="40px"
      ></app-ux-loading-block>
    </div>
  `,
  styleUrls: ['./performance-chart-card.component.scss'],
})
export class PerformanceChartCardComponent implements OnInit {
  @Input() fundPercentageEvolution: FundPercentageEvolutionChartInterface;
  @Input() interval: string;
  @Input() isChart: boolean;
  @Input() shareChart: boolean = false;

  constructor() {}

  ngOnInit() {}
}
