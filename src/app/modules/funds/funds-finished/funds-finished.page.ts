import { Component, OnInit } from '@angular/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';

@Component({
  selector: 'app-funds-finished',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds" (click)="this.clearStorage()"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'funds.funds_finished.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="ff__list">
        <app-ux-list-inverted>
          <ion-list>
            <div class="container" *ngFor="let fund of this.funds; let last = last">
              <app-fund-finished-card [fundName]="fund.nombre_bot"></app-fund-finished-card>
              <div class="list-divider" *ngIf="!last"></div>
            </div>
          </ion-list>
        </app-ux-list-inverted>
      </div>
    </ion-content>
  `,
  styleUrls: ['./funds-finished.page.scss'],
})
export class FundsFinishedPage implements OnInit {
  funds: any[] = [];

  constructor(
    private apiFundsService: ApiFundsService,
    private fundDataStorage: FundDataStorageService
  ) { }

  ionViewDidEnter() {
    this.getFundsToRenew();
  }

  getFundsToRenew() {
    this.apiFundsService.getFundsToRenew().subscribe(data => {
      this.funds = data;
    })
  }

  ngOnInit() {
    this.clearStorage();
  }

  clearStorage() {
    this.fundDataStorage.clearAll();
  }

}
