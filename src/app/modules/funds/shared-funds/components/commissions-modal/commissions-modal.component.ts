import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiCommissionsService } from '../../services/api-commission/api-commission.service';
import { ApiFundsService } from '../../services/api-funds/api-funds.service';

@Component({
  selector: 'app-commissions-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          {{ 'funds.fund_runs.show_commissions.modal_title' | translate }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button icon-only shape="round" (click)="this.closeModal()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      <ion-grid>
        <ion-row class="head-row ion-text-center">
          <ion-col>
            <h4>
              {{
                'funds.fund_runs.show_commissions.inversion_table_title'
                  | translate
              }}
            </h4>
          </ion-col>
          <ion-col>
            <h4>
              {{
                'funds.fund_runs.show_commissions.commission_table_title'
                  | translate
              }}
            </h4>
          </ion-col>
        </ion-row >
        <ion-row padding class="row ion-text-center" *ngFor="let commission of commissions">
          <ion-col>
              {{ commission | comissionName }}
          </ion-col>
          <ion-col>
            {{ commission.percentage * 100 | number: '1.2-2' }} %
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
  styleUrls: ['./commissions-modal.component.scss']
})
export class CommissionsModalComponent implements OnInit {
  commissions: any[];
  constructor(
    private modalController: ModalController,
    private apiFunds: ApiFundsService
  ) {}
  ngOnInit() {
    this.apiFunds.getCommissions().subscribe(res => (this.commissions = res));
    // this.commissions = [
    //   { inversion: '< 1 BTC', percentage: 0.2 },
    //   { inversion: '1 BTC to 5 BTC', percentage: 0.18 },
    //   { inversion: '5 BTC to 10 BTC', percentage: 0.15 },
    //   { inversion: '10 BTC to 100 BTC', percentage: 0.1 },
    //   { inversion: '> 100 BTC', percentage: 0.04 }
    // ];
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
