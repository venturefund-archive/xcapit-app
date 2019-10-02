import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiReferralsService } from '../shared-referrals/services/api-referrals/api-referrals.service';
import { IonInfiniteScroll } from '@ionic/angular';
@Component({
  selector: 'app-referrals-list',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>
          {{ 'referrals.referrals_list.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed" ion-padding>
        <ion-fab-button
          appTrackClick
          name="New Referral"
          routerDirection="forward"
          [routerLink]="['/referrals/new']"
        >
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <ion-list *ngIf="this.referrals.length === 0 && this.loading">
        <app-skeleton-referral-item
          *ngFor="let i of [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]"
        ></app-skeleton-referral-item>
      </ion-list>
      <ion-list>
        <ion-item *ngFor="let referral of this.referrals">
          {{ referral.email }}
          <ion-badge
            color="{{ referral.accepted ? 'success' : 'danger' }}"
            slot="end"
          >
            {{
              referral.accepted
                ? ('referrals.referrals_list.accepted_badge' | translate)
                : ('referrals.referrals_list.not_accepted_badge' | translate)
            }}</ion-badge
          >
        </ion-item>
      </ion-list>
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
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  referrals: any[] = [];
  queryOptions = { ordering: '-accepted,email,created_at' };
  paginationOptions = { cursor: '' };
  loading = true;
  constructor(private apiReferrals: ApiReferralsService) {}

  ionViewDidEnter() {
    this.getUserReferrals(this.getQueryParams());
  }

  getUserReferrals(options: any = null, hasInfiniteScroll?: boolean) {
    this.apiReferrals.getUserReferrals(options).subscribe(data => {
      // set new pagination options...
      this.paginationOptions.cursor = (data.cursors && data.cursors.next) || '';
      // activar el infinite scroll asi podemos ir para adelante
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
    // comprobar si hay más resultados...
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

  ngOnInit() {}
}
