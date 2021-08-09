import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonInfiniteScroll, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LINKS } from 'src/app/config/static-links';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { ApiReferralsService } from '../shared-referrals/services/api-referrals/api-referrals.service';

@Component({
  selector: 'app-referrals-list-page',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center"> {{ 'referrals.new_referral_page.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="ux_main">
        <div class="ux_content">
          <div class="src__share-referral-card">
            <app-share-referral-card [referralId]="this.referralId" *ngIf="this.referralId"></app-share-referral-card>
          </div>
          <div class="src__referrals-list__label">
            <ion-label class="ux-font-lato ux-fweight-bold ux-fsize-12" color="uxsemidark">
              {{ 'referrals.new_referral_page.points_title' | translate }}
            </ion-label>
          </div>
          <div class="src__points-card">
            <app-points-card></app-points-card>
          </div>
          <div class="src__referrals-list__label">
            <ion-label class="ux-font-lato ux-fweight-bold ux-fsize-12" color="uxsemidark">
              {{ 'referrals.new_referral_page.prize_title' | translate }}
            </ion-label>
          </div>
          <div class="src__prize-card">
            <app-prize-card></app-prize-card>
          </div>
          <div class="src__referrals-list__label">
            <ion-label class="ux-font-lato ux-fweight-bold ux-fsize-12" color="uxsemidark">
              {{ 'referrals.new_referral_page.list_title' | translate }}
            </ion-label>
          </div>
          <div class="src__referrals-list">
            <app-ux-list-inverted>
              <ion-list>
                <div class="container" *ngFor="let referral of this.referrals; let last = last">
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
                        [name]="referral.accepted ? 'ux-checked-circle' : 'hourglass-outline'"
                        color="uxsemidark"
                      ></ion-icon>
                    </div>
                  </ion-item>
                  <div class="list-divider" *ngIf="!last"></div>
                </div>
              </ion-list>
            </app-ux-list-inverted>
          </div>
          <ion-infinite-scroll threshold="200px" (ionInfinite)="this.loadMore()">
            <ion-infinite-scroll-content loadingSpinner="bubbles" loadingText="Loading more data...">
            </ion-infinite-scroll-content>
          </ion-infinite-scroll>
        </div>
        <div class="ux_footer ">
          <div class="src__help_referral_link">
            <ion-button name="Go To Help" (click)="this.goToReferralsInfo()" appTrackClick fill="clear" size="small">{{
              'shared.referrals_help.text_referrals_help_link' | translate
            }}</ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./referrals-list.page.scss'],
})
export class ReferralsListPage implements OnInit {
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
    private apiUsuarios: ApiUsuariosService,
    private alertController: AlertController,
    private translate: TranslateService,
    private navController: NavController
  ) {}

  ionViewDidEnter() {
    this.getReferralId();
    this.getUserReferrals(this.getQueryParams());
  }

  getReferralId() {
    this.apiUsuarios.getUser().subscribe((data: any) => (this.referralId = data.referral_id));
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
  goToReferralsInfo() {
    this.navController.navigateForward(['/referrals/info']);
  }

  ngOnInit() {}
}
