import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { NavController } from '@ionic/angular';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { StorageApikeysService } from '../../apikeys/shared-apikeys/services/storage-apikeys/storage-apikeys.service';

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
        [trainlingStop]="this.trailingStop"
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

  constructor(
    protected fundDataStorage: FundDataStorageService,
    protected navController: NavController,
    protected apiFunds: ApiFundsService,
    private storageApiKeysService: StorageApikeysService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.fundDataStorage.getData('fundStopLoss').then((data) => {
      if (data) {
        this.stopLoss = data.stop_loss;
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

  addApiKeyToFund(fund: any) {
    fund.api_key_id = this.storageApiKeysService.data.id;
    return fund;
  }

  async handleSubmit(data: any) {
    let fund = {
      ...(await this.fundDataStorage.getFund()),
      ...data,
    };
    fund.risk_level = `${fund.risk_level}`;
    if (this.opType === 'renew') {
      this.apiFunds.renewFund(fund).subscribe(() => this.success());
    } else {
      fund = this.addApiKeyToFund(fund);
      this.apiFunds.crud.create(fund).subscribe(
        () => this.success(),
        (e) => this.error(e)
      );
    }
  }

  async success() {
    this.fundDataStorage.clearAll();
    this.navController
      .navigateForward(['/funds/fund-success', this.opType === 'renew'], {
        replaceUrl: true,
      })
      .then();
  }

  async error(e) {
    if (e.error.error_code === 'funds.create.fundNameExists') {
      this.navController.navigateBack('/funds/fund-name').then();
    }
  }
}
