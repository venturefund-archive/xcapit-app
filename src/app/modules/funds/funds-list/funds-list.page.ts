import { Component, OnInit } from '@angular/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { NavController, LoadingController } from '@ionic/angular';
import { TabsComponent } from '../../tabs/tabs/tabs.component';

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
              <img src="assets/img/user-profile/avatar-default.png" />
            </ion-avatar>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end" *ngIf="false">
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
      <app-fund-list-sub-header
        *ngIf="
          this.ownerFundBalances?.length &&
          this.status?.status_name == 'COMPLETE'
        "
      ></app-fund-list-sub-header>

      <app-ux-loading-block
        *ngIf="this.status?.status_name == ''"
        minSize="50px"
      ></app-ux-loading-block>

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
            <app-fund-card [fund]="fb" *ngIf="fb"></app-fund-card>
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

      <!-- Info -->
      <div class="academy ion-padding">
        <div
          class="academy__info__title ux-font-lato ux-fweight-semibold ux-fsize-12"
        >
          {{ 'funds.funds_list.info_title' | translate }}
        </div>
        <div
          class="academy__card_info_binance"
          *ngIf="
            this.status.profile_valid &&
            !this.status.empty_linked_keys &&
            !this.status.has_own_funds
          "
        >
          <app-ux-card-info-binance></app-ux-card-info-binance>
        </div>
        <div class="academy__card_info_robot">
          <app-ux-card-info-robot></app-ux-card-info-robot>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./funds-list.page.scss'],
})
export class FundsListPage implements OnInit {
  ownerFundBalances: Array<any>;
  notOwnerFundBalances: Array<any>;
  hasNotifications = true;

  status = {
    profile_valid: false,
    empty_linked_keys: false,
    has_own_funds: false,
    has_subscribed_funds: false,
    status_name: '',
  };

  actionButton: {
    name: string;
    text: string;
  };
  newFundUrl: string;

  steps: any;

  constructor(
    private apiFundsService: ApiFundsService,
    private translate: TranslateService,
    private apiUsuarios: ApiUsuariosService,
    private navController: NavController,
    private tabsComponent: TabsComponent
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getStatus();
  }

  ionViewDidEnter() {
    this.getOwnerFundBalances();
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
        text: this.translate.instant('funds.funds_list.fund_steps.step1'),
      },
      {
        icon: this.status.empty_linked_keys ? 'ux-checked-circle' : 'ux-step-2',
        text: this.translate.instant('funds.funds_list.fund_steps.step2'),
      },
      {
        icon: 'ux-step-3',
        text: this.translate.instant('funds.funds_list.fund_steps.step3'),
      },
    ];
  }

  setActionButton() {
    if (!this.status.profile_valid) {
      this.actionButton = {
        name: 'Configure Account',
        text: this.translate.instant(
          'funds.funds_list.fund_steps.action_button1'
        ),
      };
    } else if (!this.status.empty_linked_keys) {
      this.actionButton = {
        name: 'Link with Binance',
        text: this.translate.instant(
          'funds.funds_list.fund_steps.action_button2'
        ),
      };
    } else {
      this.actionButton = {
        name: 'Create New Fund',
        text: this.translate.instant(
          'funds.funds_list.fund_steps.action_button3'
        ),
      };
    }
  }

  private getOwnerFundBalances() {
    this.apiFundsService.getFundBalances(true, false).subscribe((res) => {
      this.ownerFundBalances = res;
      this.getNotOwnerFundBalances();
    });
  }

  private getNotOwnerFundBalances() {
    this.apiFundsService.getFundBalances(false, false).subscribe((res) => {
      this.notOwnerFundBalances = res;
    });
  }

  showNotifications() {
    // TODO: Implementar notificaciones.
    this.navController.navigateForward('notifications/list');
  }

  goToProfile() {
    this.navController.navigateForward('profiles/user');
  }

  doActionButton() {
    this.navController.navigateRoot(this.newFundUrl);
  }

  setNewFundUrl() {
    this.newFundUrl = !this.status.profile_valid
      ? 'profiles/personal-data'
      : !this.status.empty_linked_keys
      ? 'apikeys/tutorial'
      : 'funds/fund-name';
    this.tabsComponent.newFundUrl = this.newFundUrl;
  }
}
