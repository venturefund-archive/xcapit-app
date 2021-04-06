import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { NavController } from '@ionic/angular';
import { TabsComponent } from '../../tabs/tabs/tabs.component';
import { ApiWebflowService } from 'src/app/shared/services/api-webflow/api-webflow.service';
import { EMPTY, Subject, Subscription, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { RefreshTimeoutService } from '../../../shared/services/refresh-timeout/refresh-timeout.service';

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
                      <ion-avatar class="avatar">
                          <img src="assets/img/user-profile/avatar-default.png"/>
                      </ion-avatar>
                  </ion-button>
              </ion-buttons>
              <ion-buttons slot="end" *ngIf="true">
                  <ion-button
                          appTrackClick
                          name="Show Notifications"
                          (click)="this.showNotifications()"
                  >
                      <ion-icon slot="icon-only" name="ux-bell"></ion-icon>
                      <div class="notificationQty" *ngIf="this.unreadNotifications > 0">
                          {{ this.unreadNotifications }}
                      </div>
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
          <app-ux-loading-block
                  *ngIf="this.status?.status_name == ''"
                  minSize="50px"
          ></app-ux-loading-block>
          <app-fund-list-sub-header
                  *ngIf="
          this.ownerFundBalances?.length &&
          this.status?.status_name == 'COMPLETE'
        "
          ></app-fund-list-sub-header>


          <!-- Steps -->
          <div
                  class="fund_steps"
                  *ngIf="
          this.status?.status_name != 'COMPLETE' &&
          this.status?.status_name != ''
        "
          >
              <div class="fund_steps__subheader_bg"></div>
              <div class="fund_steps__card ion-padding">
                  <div class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22">
                      <ion-text>{{
                          'funds.funds_list.fund_steps.title' | translate
                          }}</ion-text>
                  </div>
                  <div class="fund_steps__card__steps">
                      <div
                              class="fund_steps__card__steps__step"
                              *ngFor="let step of steps"
                      >
                          <div class="step_icon">
                              <ion-icon [name]="step.icon" class="ux-fsize-22"></ion-icon>
                          </div>
                          <div class="step_text" color="uxdark">
                              <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-14">{{
                                  step.text
                                  }}</ion-text>
                          </div>
                      </div>
                  </div>
                  <div class="fund_steps__card__buttons">
                      <ion-button
                              appTrackClick
                              [dataToTrack]="{ description: this.actionButton?.name }"
                              name="Action Button"
                              class="ux_button"
                              type="button"
                              color="primary"
                              expand="block"
                              size="medium"
                              (click)="doActionButton()"
                      >
                          {{ this.actionButton?.text | translate }}
                      </ion-button>
                  </div>
              </div>
          </div>

          <ion-refresher
                  (ionRefresh)="doRefresh($event)"
                  slot="fixed"
                  pull-factor="0.6"
                  pull-min="50"
                  pull-max="60"
          >
              <ion-refresher-content
                      class="refresher"
                      close-duration="120ms"
                      refreshingSpinner="false"
              >
                  <app-ux-loading-block *ngIf="this.isRefreshAvailable$ | async" minSize="34px"></app-ux-loading-block>
                  <ion-text *ngIf="!(this.isRefreshAvailable$ | async)">
                      {{ 'funds.funds_list.refresh_time' | translate: {
                      seconds: (this.refreshRemainingTime$ | async)
                  }
                      }}
                  </ion-text>

              </ion-refresher-content>
          </ion-refresher>


          <!-- Fund lists -->
          <div class="fl" *ngIf="this.status?.status_name == 'COMPLETE'">
              <div
                      *ngIf="this.ownerFundBalances?.length"
                      class="fl__funds ion-padding"
              >
                  <div
                          class="fl__funds__title ux-font-lato ux-fweight-semibold ux-fsize-12"
                  >
                      {{ 'funds.funds_list.funds_title' | translate }}
                  </div>

                  <app-ux-loading-block
                          minSize="50px"
                          *ngIf="!this.ownerFundBalances"
                  ></app-ux-loading-block>

                  <div class="fl__funds__card" *ngFor="let fb of ownerFundBalances">
                      <app-fund-card
                              [fund]="fb"
                              *ngIf="fb.state == 'active'"
                      ></app-fund-card>
                  </div>

                  <div class="fl__funds__card" *ngFor="let fb of ownerFundBalances">
                      <app-fund-card
                              [fund]="fb"
                              *ngIf="fb.state == 'finalizado'"
                      ></app-fund-card>
                  </div>
              </div>
          </div>
          <div class="fl" *ngIf="this.notOwnerFundBalances?.length">
              <div class="fl__funds ion-padding">
                  <div
                          class="fl__funds__title ux-font-lato ux-fweight-semibold ux-fsize-12"
                  >
                      {{ 'funds.funds_list.shared_funds_title' | translate }}
                  </div>
                  <app-ux-loading-block
                          minSize="50px"
                          *ngIf="!this.notOwnerFundBalances"
                  ></app-ux-loading-block>
                  <div
                          class="fl__funds__card"
                          *ngFor="let nofb of notOwnerFundBalances"
                  >
                      <app-fund-card [fund]="nofb"></app-fund-card>
                  </div>
              </div>
          </div>
          <div
                  class="academy ion-padding"
                  *ngIf="
          this.status.profile_valid &&
          !this.status.empty_linked_keys &&
          !this.status.has_own_funds
        "
          >
              <div
                      class="academy__info__title ux-font-lato ux-fweight-semibold ux-fsize-12"
              >
                  <ion-label color="uxsemidark">
                      {{ 'funds.funds_list.info_title' | translate }}
                  </ion-label>
              </div>
              <div class="academy__card_info_binance">
                  <app-ux-card-info-binance></app-ux-card-info-binance>
              </div>
          </div>
          <!-- Slider News -->
          <div class="academy ion-padding" *ngIf="this.news">
              <div
                      class="academy__news__title ux-font-lato ux-fweight-semibold ux-fsize-12"
              >
                  <ion-label color="uxsemidark">{{
                      'funds.funds_list.news_title' | translate
                      }}</ion-label>
              </div>
              <app-fund-slider-news [news]="this.news"></app-fund-slider-news>
          </div>
      </ion-content>
  `,
  styleUrls: ['./funds-list.page.scss']
})
export class FundsListPage implements OnInit, OnDestroy {
  ownerFundBalances: Array<any>;
  notOwnerFundBalances: Array<any>;
  news: Array<any>;
  hasNotifications = false;
  lockActivated = false;

  status = {
    profile_valid: false,
    empty_linked_keys: false,
    has_own_funds: false,
    has_subscribed_funds: false,
    status_name: ''
  };

  actionButton: {
    name: string;
    text: string;
  };
  newFundUrl: string;

  steps: any;
  isRefreshAvailable$ = this.refreshTimeoutService.isAvailableObservable;
  refreshRemainingTime$ = this.refreshTimeoutService.remainingTimeObservable;

  private notificationQtySubscription: Subscription;
  private notificationQtySubject = new Subject();
  private timerSubscription: Subscription;
  public unreadNotifications: number;

  constructor(
    private apiFundsService: ApiFundsService,
    private translate: TranslateService,
    private apiUsuarios: ApiUsuariosService,
    private navController: NavController,
    private tabsComponent: TabsComponent,
    private apiWebflow: ApiWebflowService,
    private notificationsService: NotificationsService,
    private refreshTimeoutService: RefreshTimeoutService
  ) {
  }

  ngOnInit() {
    this.initQtyNotifications();

    const minutes = 0.5;
    this.timerSubscription = timer(0, minutes * 60000).subscribe(() => {
      this.notificationQtySubject.next();
    });
  }

  ionViewWillEnter() {
    this.getStatus();
  }

  async ionViewDidEnter() {
    this.ownerFundBalances = await this.getOwnerFundBalances().toPromise();
    this.notOwnerFundBalances = await this.getNotOwnerFundBalances().toPromise();
    this.news = await this.getNews().toPromise();
  }

  initQtyNotifications() {
    this.notificationQtySubscription = this.notificationQtySubject
      .pipe(
        switchMap(() =>
          this.notificationsService.getCountNotifications().pipe(
            catchError((err) => {
              return EMPTY;
            })
          )
        )
      )
      .subscribe((res: any) => (this.unreadNotifications = res['count']));

    this.notificationQtySubject.next();
  }

  getStatus() {
    this.apiUsuarios.status(false).subscribe((res) => {
      this.status = res;
      this.setSteps();
      this.setActionButton();
      this.setNewFundUrl();
    });
  }

  setSteps() {
    this.steps = [
      {
        icon: this.status.profile_valid ? 'ux-checked-circle' : 'ux-step-1',
        text: this.translate.instant('funds.funds_list.fund_steps.step1')
      },
      {
        icon: this.status.empty_linked_keys ? 'ux-checked-circle' : 'ux-step-2',
        text: this.translate.instant('funds.funds_list.fund_steps.step2')
      },
      {
        icon: 'ux-step-3',
        text: this.translate.instant('funds.funds_list.fund_steps.step3')
      }
    ];
  }

  setActionButton() {
    if (!this.status.profile_valid) {
      this.actionButton = {
        name: 'Configure Account',
        text: this.translate.instant(
          'funds.funds_list.fund_steps.action_button1'
        )
      };
    } else if (!this.status.empty_linked_keys) {
      this.actionButton = {
        name: 'Link with Binance',
        text: this.translate.instant(
          'funds.funds_list.fund_steps.action_button2'
        )
      };
    } else {
      this.actionButton = {
        name: 'Create New Fund',
        text: this.translate.instant(
          'funds.funds_list.fund_steps.action_button3'
        )
      };
    }
  }

  private getOwnerFundBalances() {
    return this.apiFundsService.getFundBalances(true, false).pipe(
      map(res => this.filterPausedFunds(res))
    );
  }

  private getNotOwnerFundBalances() {
    return this.apiFundsService.getFundBalances(false, false);
  }

  filterPausedFunds(array: any) {
    return (array = array.filter((obj) => obj.state !== 'pausado'));
  }

  showNotifications() {
    this.navController.navigateForward('notifications/list');
    this.unreadNotifications = 0;
  }

  goToProfile() {
    this.navController.navigateForward('profiles/user');
  }

  doActionButton() {
    this.navController.navigateRoot(this.newFundUrl);
  }

  async doRefresh(event) {
    if (this.refreshTimeoutService.isAvailable()) {
      this.ownerFundBalances = await this.getOwnerFundBalances().toPromise();
      this.notOwnerFundBalances = await this.getNotOwnerFundBalances().toPromise();
      this.news = await this.getNews().toPromise();
      this.refreshTimeoutService.lock();
      event.target.complete();
    } else {
      setTimeout(() => event.target.complete(), 1000);
    }
  }

  setNewFundUrl() {
    this.newFundUrl = !this.status.profile_valid
      ? 'profiles/personal-data'
      : !this.status.empty_linked_keys
        ? 'apikeys/tutorial'
        : 'funds/fund-name';
    this.tabsComponent.newFundUrl = this.newFundUrl;
  }

  getNews() {
    return this.apiWebflow.getNews();
  }

  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
    this.notificationQtySubscription.unsubscribe();
    this.refreshTimeoutService.unsubscribe();
  }


}
