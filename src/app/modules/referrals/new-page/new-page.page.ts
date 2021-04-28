import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-page',
  template: `

    <ion-header>
          <ion-toolbar color="uxprimary" class="ux_toolbar">
              <ion-buttons slot="start">
                  <ion-back-button defaultHref="tabs/funds"></ion-back-button>
              </ion-buttons>
              <ion-title class="ion-text-center"> {{ 'referrals.referrals_list.header' | translate }}</ion-title>
          </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
          <div class="ric__referral-id-card">
              <!-- <app-referral-id-card [referralId]="this.referralId" *ngIf="this.referralId"></app-referral-id-card> -->
              <!-- VER ESTA LINEA --> DIEGO
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
  styleUrls: ['./new-page.page.scss'],
})
export class NewPagePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
