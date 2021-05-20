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
        [page]="this.page"
      ></app-fund-performance-chart>
      <app-ux-loading-block *ngIf="!this.fundPercentageEvolution" minSize="40px"></app-ux-loading-block>
    </div>
  `,
  styleUrls: ['./performance-chart-card.component.scss'],
})
export class PerformanceChartCardComponent implements OnInit {
  @Input() fundPercentageEvolution: FundPercentageEvolutionChartInterface;
  @Input() interval: string;
  @Input() shareChart = false;
  @Input() page: string;

  constructor() {}

  ngOnInit() {}
}
