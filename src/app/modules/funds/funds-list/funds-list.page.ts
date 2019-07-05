import { Component, OnInit } from '@angular/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { SubscriptionsService } from '../../subscriptions/shared-subscriptions/services/subscriptions/subscriptions.service';

@Component({
  selector: 'app-funds-list',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ 'funds.funds_list.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="ion-padding">
        <ion-button
          type="button"
          expand="full"
          size="large"
          color="success"
          [routerLink]="['/tutorials/interactive-tutorial']"
        >
          <ion-icon slot="start" name="add"></ion-icon>
          {{ 'funds.funds_list.new_fund_button' | translate }}
        </ion-button>
        <ion-list>
          <ion-item
            button
            routerDirection="forward"
            *ngFor="let sf of subscribedFunds"
            [routerLink]="['/funds/fund-summary/' + sf.nombre_bot]"
          >
            <ion-row nowrap style="width:100%">
              <ion-col>
                {{ sf.fecha | date: 'dd/MM/yyyy hh:mm' }}
              </ion-col>
              <ion-col>
                {{ sf.nombre_bot }}
              </ion-col>
              <ion-col>
                <ion-badge *ngIf="sf.is_owner" color="success">{{
                  'funds.funds_list.owner_text' | translate
                }}</ion-badge>
              </ion-col>
            </ion-row>
          </ion-item>
        </ion-list>
      </div>
    </ion-content>
  `,
  styleUrls: ['./funds-list.page.scss']
})
export class FundsListPage implements OnInit {
  subscribedFunds: Array<any> = [];
  constructor(
    private apiFundsService: ApiFundsService
  ) {}
  ngOnInit() {}

  ionViewDidEnter() {
    this.getSubscribedFunds();
  }

  private getSubscribedFunds() {
    this.apiFundsService.getSubscribedFunds().subscribe(res => {
      this.subscribedFunds = res;
    });
  }
}
