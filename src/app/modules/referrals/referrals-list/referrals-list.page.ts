import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiReferralsService } from '../shared-referrals/services/api-referrals/api-referrals.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';

@Component({
  selector: 'app-referrals-list',
  template: `
      <ion-header>
          <ion-toolbar color="uxprimary" class="ux_toolbar">
              <ion-buttons slot="start">
                  <ion-back-button defaultHref="tabs/funds"></ion-back-button>
              </ion-buttons>
              <ion-title class="ion-text-center"> {{ 'referrals.referrals_list.header' | translate }}</ion-title>
              <ion-buttons slot="end">
                  <ion-button
                          class="ux-font-lato ux-fweight-semibold ux-fsize-14 ion-padding-end"
                          appTrackClick
                          name="New Referral"
                          routerDirection="forward"
                          [routerLink]="['/referrals/new']"
                  >
                      {{'referrals.referrals_list.new_button' | translate}}
                  </ion-button>
              </ion-buttons>
          </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
          <div class="ric__referral-id-card">
              <app-referral-id-card [referralId]="this.referralId" *ngIf="this.referralId"></app-referral-id-card>
          </div>
              <div class="ric__referrals-list__label">
                  <ion-label
                          class="ux-font-lato ux-fweight-bold ux-fsize-12"
                          color="uxsemidark"
                  >
                      {{ 'referrals.referrals_list.list_title' | translate }}
                  </ion-label>
              </div>
          <div class="ric__referrals-list">
              <app-ux-list-inverted>
                  <ion-list>
                      <div
                              class="container"
                              *ngFor="let referral of this.referrals; let last = last"
                      >
                          <ion-item>
                              <ion-label>
                                  <h2>
                                      {{ referral.email }}
                                  </h2>
                                  <h3>
                                      {{referral.created_at | localizedDate}}
                                  </h3>
                              </ion-label>
                              <div class="ric__referrals-list__accepted">
                                  <ion-icon [name]="referral.accepted ? 'ux-checked-circle' : 'hourglass-outline'"
                                            color="uxmedium"></ion-icon>
                              </div>
                          </ion-item>
                          <div class="list-divider" *ngIf="!last"></div>
                      </div>
                  </ion-list>
              </app-ux-list-inverted>
          </div>
          <ion-infinite-scroll threshold="200px" (ionInfinite)="this.loadMore()">
              <ion-infinite-scroll-content
                      loadingSpinner="bubbles"
                      loadingText="Loading more data..."
              >
              </ion-infinite-scroll-content>
          </ion-infinite-scroll>
      </ion-content>
  `,
  styleUrls: ['./referrals-list.page.scss']
})
export class ReferralsListPage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;
  referrals: any[] = [];
  queryOptions = { ordering: '-created_at' };
  paginationOptions = { cursor: '' };
  loading = true;
  referralId: any;

  constructor(
    private apiReferrals: ApiReferralsService,
    private apiUsuarios: ApiUsuariosService
  ) {
  }

  ionViewDidEnter() {
    this.getReferralId();
    this.getUserReferrals(this.getQueryParams());
  }

  getReferralId() {
    this.apiUsuarios
      .getUser()
      .subscribe((data: any) => (this.referralId = data.referral_id));
  }


  getUserReferrals(options: any = null, hasInfiniteScroll?: boolean) {
    this.apiReferrals.getUserReferrals(options).subscribe(data => {
      // set new pagination options...
      this.paginationOptions.cursor = (data.cursors && data.cursors.next) || '';
      // activate infinite scroll
      if (hasInfiniteScroll) {
        this.referrals = [...this.referrals, ...data.results];
        this.infiniteScroll.complete();
      } else {
        this.referrals = data.results;
      }
      this.loading = false;
      this.infiniteScroll.disabled = !this.paginationOptions.cursor;
    });
  }

  loadMore() {
    if (this.paginationOptions.cursor) {
      this.getUserReferrals(this.getQueryParams(), true);
    }
  }

  private getQueryParams() {
    return {
      ...this.queryOptions,
      ...this.paginationOptions
    };
  }

  ngOnInit() {
  }
}
