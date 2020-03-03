import { Component, OnInit } from '@angular/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';

@Component({
  selector: 'app-funds-list',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-button
            appTrackClick
            name="Go To Profile"
            (click)="this.goToProfile()"
          >
            <ion-icon slot="icon-only" name="person"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button
            appTrackClick
            name="Show Notifications"
            (click)="this.showNotifications()"
          >
            <ion-icon
              slot="icon-only"
              name="ux-bell"
              *ngIf="!this.hasNotifications"
            ></ion-icon>
            <ion-icon
              slot="icon-only"
              name="ux-bell-badge"
              *ngIf="this.hasNotifications"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
        <div class="header">
          <div class="header__logo ion-text-center">
            <app-xcapit-logo></app-xcapit-logo>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="fl">
        <app-fund-list-sub-header></app-fund-list-sub-header>
        <div class="fl__funds ion-padding">
          <div
            class="fl__funds__title ux-font-lato ux-fweight-semibold ux-fsize-12"
          >
            {{ 'funds.funds_list.funds_title' | translate }}
          </div>

          <div class="fl__funds__card" *ngFor="let fb of ownerFundBalances">
            <app-fund-card [fund]="fb"></app-fund-card>
          </div>
        </div>
        <div class="fl__funds ion-padding">
          <div
            class="fl__funds__title ux-font-lato ux-fweight-semibold ux-fsize-12"
          >
            {{ 'funds.funds_list.shared_funds_title' | translate }}
          </div>

          <div
            class="fl__funds__card"
            *ngFor="let nofb of notOwnerFundBalances"
          >
            <app-fund-card [fund]="nofb"></app-fund-card>
          </div>
        </div>
      </div>
      <div class="academy ion-padding">
        <div
          class="academy__info__title ux-font-lato ux-fweight-semibold ux-fsize-12"
        >
          {{ 'funds.funds_list.info_title' | translate }}
        </div>
        <div class="academy__card_info_robot">
          <app-ux-card-info-robot></app-ux-card-info-robot>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./funds-list.page.scss']
})
export class FundsListPage implements OnInit {
  ownerFundBalances: Array<any> = [];
  notOwnerFundBalances: Array<any> = [];
  hasNotifications = true;

  constructor(private apiFundsService: ApiFundsService) {}
  ngOnInit() {}

  ionViewDidEnter() {
    this.getOwnerFundBalances();
  }

  private getOwnerFundBalances() {
    this.apiFundsService.getFundBalances(true).subscribe(res => {
      this.ownerFundBalances = res;
      this.getNotOwnerFundBalances();
    });
  }

  private getNotOwnerFundBalances() {
    this.apiFundsService.getFundBalances(false).subscribe(res => {
      this.notOwnerFundBalances = res;
    });
  }

  showNotifications() {
    // TODO: Implementar notificaciones.
    console.error('Notificaciones no implementadas');
  }

  goToProfile() {
    // TODO: Implementar profile.
    console.error('Profile no implementado');
  }
}
