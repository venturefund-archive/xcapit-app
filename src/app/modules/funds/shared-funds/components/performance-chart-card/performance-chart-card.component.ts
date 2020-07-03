import { Component, OnInit, Input } from '@angular/core';
import { FundPercentageEvolutionChartInterface } from './fund-performance-chart.interface';

@Component({
  selector: 'app-performance-chart-card',
  template: `
    <div class="fpcc">
      <app-fund-performance-chart
        *ngIf="this.fundPercentageEvolution"
        [fundPercentageEvolution]="this.fundPercentageEvolution"
        [interval]="interval"
      ></app-fund-performance-chart>
    </div>
  `,
  styleUrls: ['./performance-chart-card.component.scss'],
})
export class PerformanceChartCardComponent implements OnInit {
  @Input() fundPercentageEvolution: FundPercentageEvolutionChartInterface;
  @Input() interval: string;

  constructor() {}

  ngOnInit() {}
}
