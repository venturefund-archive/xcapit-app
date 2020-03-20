import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fund-operations-history',
  template: `
    <h1>Operations</h1>
    <ul>
    <li *ngFor="let op of operations">
    Run {{op.id_corrida}} - {{op.fecha_inicio | date}}
    </li>
    </ul>
  `,
  styleUrls: ['./fund-operations-history.component.scss']
})
export class FundOperationsHistoryComponent implements OnInit {
  @Input() operations: Array<any>;
  constructor() {}

  ngOnInit() {}
}
