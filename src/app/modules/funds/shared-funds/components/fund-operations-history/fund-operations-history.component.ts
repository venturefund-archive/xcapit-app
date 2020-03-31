import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fund-operations-history',
  template: `
    <div class="foh">
      <div class="foh__content">
        <app-ux-selectable-list>
          <div
            class="item"
            *ngFor="let o of this.operations"
            appTrackClick
            name="View Run Details"
            (click)="this.viewRunDetails()"
          >
            <div class="title">
              {{
                'funds.fund_detail.operations_history_card.run'
                  | translate: { id_corrida: o.id_corrida }
              }}
            </div>
            <div class="subtitle">
              {{ o.fecha_inicio | localizedDate: 'longDate' }}
            </div>
            <div class="button">
              <ion-icon name="ux-forward"></ion-icon>
            </div>
          </div>
        </app-ux-selectable-list>
      </div>
    </div>
  `,
  styleUrls: ['./fund-operations-history.component.scss']
})
export class FundOperationsHistoryComponent implements OnInit {
  @Input() operations: Array<any>;

  constructor() {}

  ngOnInit() {}

  viewRunDetails() {
    console.error('View run details no implemented.');
  }
}
