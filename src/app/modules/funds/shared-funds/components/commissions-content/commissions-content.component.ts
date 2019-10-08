import { Component, OnInit } from '@angular/core';
import { ApiFundsService } from '../../services/api-funds/api-funds.service';

@Component({
  selector: 'app-commissions-content',
  template: `
    <div>
      <ion-grid>
        <ion-row class="head-row ion-text-center">
          <ion-col>
            <h4>
              {{ 'funds.commissions.inversion_table_title' | translate }}
            </h4>
          </ion-col>
          <ion-col>
            <h4>
              {{ 'funds.commissions.commission_table_title' | translate }}
            </h4>
          </ion-col>
        </ion-row>
        <ion-row
          class="row ion-text-center ion-padding"
          *ngFor="let commission of commissions"
        >
          <ion-col>
            {{ commission | comissionName }}
          </ion-col>
          <ion-col>
            {{ commission.percentage * 100 | number: '1.2-2' }} %
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  `,
  styleUrls: ['./commissions-content.component.scss']
})
export class CommissionsContentComponent implements OnInit {
  commissions: any[];

  constructor(private apiFunds: ApiFundsService) {}

  ngOnInit() {
    this.apiFunds.getCommissions().subscribe(res => (this.commissions = res));
  }
}
