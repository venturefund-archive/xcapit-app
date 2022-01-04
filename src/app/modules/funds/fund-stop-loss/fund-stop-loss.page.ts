import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-fund-stop-loss',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/funds/fund-take-profit"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">
          {{ 'funds.fund_stop_loss.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <app-fund-select-stop-loss
        *ngIf="this.profile"
        [opType]="this.opType"
        [stopLoss]="this.stopLoss"
        [trailingStop]="this.trailingStop"
        [profile]="this.profile"
        (save)="this.handleSubmit($event)"
      ></app-fund-select-stop-loss>
    </ion-content>
  `,
  styleUrls: ['./fund-stop-loss.page.scss'],
})
export class FundStopLossPage implements OnInit {
  @ViewChild('editStopLossForm') editStopLossForm: FormGroupDirective;
  fund: any;
  stopLoss: number;
  profile: string;
  trailingStop: number;
  opType: string;

  constructor(protected fundDataStorage: FundDataStorageService, protected navController: NavController) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.fundDataStorage.getData('fundStopLoss').then((data) => {
      if (data && data.stop_loss) {
        this.stopLoss = data.stop_loss;
      }
      if (data && data.trailing_stop) {
        this.trailingStop = data.trailing_stop;
      }
    });

    this.fundDataStorage.getData('fundRenew').then((data) => {
      this.opType = data ? 'renew' : 'new';
    });

    this.fundDataStorage.getData('fundRiskLevel').then((data) => {
      if (data) {
        this.profile = data.risk_level;
      }
    });
  }

  async handleSubmit(data: any) {
    await this.fundDataStorage.setData('fundStopLoss', data);
    await this.navController.navigateForward(['/funds/summary']);
  }
}
