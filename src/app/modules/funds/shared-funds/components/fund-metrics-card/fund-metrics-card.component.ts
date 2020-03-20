import { Component, OnInit, Input } from '@angular/core';
import { FundMetricsInterface } from './fund-metrics.interface';

@Component({
  selector: 'app-fund-metrics-card',
  template: `
  <h1>Metricas</h1>
  `,
  styleUrls: ['./fund-metrics-card.component.scss'],
})
export class FundMetricsCardComponent implements OnInit {
  @Input() metrics: FundMetricsInterface;

  constructor() { }

  ngOnInit() {}

}
