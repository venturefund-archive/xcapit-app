import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-provider',
  template:`
  <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">
          {{ 'referrals.new_referral_page.header' | translate }}</ion-title
        >
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="ux_main">
        <div class="ux_content">
          <div class="src__referrals-list">
            <app-ux-list-inverted>
              <ion-list>
                <div
                  class="container"
                  *ngFor="let provider of this.providers; let last = last"
                >
                  <ion-item>
                    <ion-label>
                      <h2>
                        {{ provider.email | hideReferral }}
                      </h2>
                      <h3>
                        {{ provider.created_at | localizedDate }}
                      </h3>
                    </ion-label>
                    <div class="src__referrals-list__accepted">
                      <ion-icon
                        [name]="
                          referral.accepted
                            ? 'ux-checked-circle'
                            : 'hourglass-outline'
                        "
                        color="uxmedium"
                      ></ion-icon>
                    </div>
                  </ion-item>
                  <div class="list-divider" *ngIf="!last"></div>
                </div>
              </ion-list>
            </app-ux-list-inverted>
          </div>
          <ion-infinite-scroll
            threshold="200px"
            (ionInfinite)="this.loadMore()"
          >
            <ion-infinite-scroll-content
              loadingSpinner="bubbles"
              loadingText="Loading more data..."
            >
            </ion-infinite-scroll-content>
          </ion-infinite-scroll>
        </div>
      </div>
    </ion-content>`,
  styleUrls: ['./select-provider.page.scss'],
})
export class SelectProviderPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
