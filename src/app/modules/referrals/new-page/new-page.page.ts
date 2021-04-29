import { Component, OnInit, ViewChild } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { LINKS } from 'src/app/config/static-links';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { ApiReferralsService } from '../shared-referrals/services/api-referrals/api-referrals.service';

const { Browser } = Plugins;
@Component({
  selector: 'app-new-page',
  template: `
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
      <div class="src__share-referral-card">
        <app-share-referral-card
          [referralId]="this.referralId"
          *ngIf="this.referralId"
        ></app-share-referral-card>
      </div>
      <div class="src__referrals-list__label">
        <ion-label
          class="ux-font-lato ux-fweight-bold ux-fsize-12"
          color="uxsemidark"
        >
          {{ 'referrals.new_referral_page.points_title' | translate }}
        </ion-label>
      </div>
      <div class="src__points-card">
        <app-points-card></app-points-card>
      </div>
      <div class="src__referrals-list__label">
        <ion-label
          class="ux-font-lato ux-fweight-bold ux-fsize-12"
          color="uxsemidark"
        >
          {{ 'referrals.new_referral_page.list_title' | translate }}
        </ion-label>
      </div>
      <div class="src__referrals-list">
        <app-ux-list-inverted>
          <ion-list>
            <div
              class="container"
              *ngFor="let referral of this.referrals; let last = last"
            >
              <ion-item>
                <ion-label>
                  <h2>
                    {{ referral.email | hideReferral }}
                  </h2>
                  <h3>
                    {{ referral.created_at | localizedDate }}
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
      
      <ion-infinite-scroll threshold="200px" (ionInfinite)="this.loadMore()">
        <ion-infinite-scroll-content
          loadingSpinner="bubbles"
          loadingText="Loading more data..."
        >
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
    <div class="ux_footer">
        <div class="src__help_referral_link">
          <ion-button
            name="Go To Help"
            (click)="this.referralsInfo()"
            appTrackClick
            fill="clear"
            size="small"
            >{{
              'shared.referrals_help.text_referrals_help_link' | translate
            }}</ion-button
          >
        </div>
      </div>
  `,
  styleUrls: ['./new-page.page.scss'],
})
export class NewPagePage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;
  referrals: any[] = [];
  queryOptions = { ordering: '-created_at' };
  paginationOptions = { cursor: '' };
  loading = true;
  referralId: any;
  links = LINKS;

  constructor(
    private apiReferrals: ApiReferralsService,
    private apiUsuarios: ApiUsuariosService
  ) {}

  ionViewDidEnter() {
    this.getReferralId();
    this.getUserReferrals(this.getQueryParams());
  }

  getReferralId() {
    this.apiUsuarios
      .getUser()
      .subscribe((data: any) => (this.referralId = data.referral_id));
  }

  async referralsInfo() {
    await Browser.open({
      toolbarColor: '#ff9100',
      url: this.links.generalHelp,
    });
  }

  getUserReferrals(options: any = null, hasInfiniteScroll?: boolean) {
    this.apiReferrals.getUserReferrals(options).subscribe((data) => {
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
      ...this.paginationOptions,
    };
  }

  ngOnInit() {}
}
