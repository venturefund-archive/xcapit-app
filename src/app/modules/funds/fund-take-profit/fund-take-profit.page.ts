import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { NavController } from '@ionic/angular';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';

@Component({
  selector: 'app-fund-take-profit',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/funds/fund-investment"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center" *ngIf="this.opType === 'renew'">
          {{ 'funds.fund_take_profit.header_renew' | translate }}</ion-title
        >
        <ion-title class="ion-text-center" *ngIf="this.opType === 'new'">
          {{ 'funds.fund_take_profit.header' | translate }}</ion-title
        >
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <app-fund-select-take-profit
        [opType]="this.opType"
        [takeProfit]="this.takeProfit"
        (save)="this.handleSubmit($event)"
      ></app-fund-select-take-profit>
    </ion-content>
  `,
  styleUrls: ['./fund-take-profit.page.scss'],
})
export class FundTakeProfitPage implements OnInit {
  opType: string;
  takeProfit: number;

  constructor(
    public submitButtonService: SubmitButtonService,
    private fundDataStorage: FundDataStorageService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.fundDataStorage.getData('fundTakeProfit').then((data) => {
      if (data) {
        this.takeProfit = data.take_profit;
      }
    });

    this.fundDataStorage.getData('fundRenew').then((data) => {
      this.opType = data ? 'renew' : 'new';
    });
  }

  handleSubmit(data: any) {
    this.fundDataStorage.setData('fundTakeProfit', data);
    this.navController.navigateForward(['funds/fund-stop-loss']);
  }
}
