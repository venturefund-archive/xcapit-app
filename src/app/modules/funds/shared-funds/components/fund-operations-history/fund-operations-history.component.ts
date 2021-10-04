import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fund-operations-history',
  template: `
    <div class="foh">
      <div class="foh__content">
        <ion-list>
          <div class="item" *ngFor="let o of this.operations" appTrackClick name="View Run Details">
            <div class="title">{{ o.nombre_bot }} {{ o.estado | titlecase }}</div>
            <div class="subtitle">
              {{ o.fecha_inicio | localizedDate: 'longDate' }}
            </div>
            <div class="button">
              <ion-icon name="ux-forward"></ion-icon>
            </div>
          </div>
        </ion-list>
      </div>
    </div>
  `,
  styleUrls: ['./fund-operations-history.component.scss'],
})
export class FundOperationsHistoryComponent implements OnInit {
  @Input() operations: Array<any>;

  constructor() {}

  ngOnInit() {}
}
