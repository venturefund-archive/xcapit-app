import { Component, OnInit } from '@angular/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { NavController } from '@ionic/angular';

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
            <img src="assets/img/user-profile/avatar-default.png">
          </ion-avatar>
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
      <app-fund-list-sub-header
        *ngIf="this.hasOwnerFunds"
      ></app-fund-list-sub-header>

      <!-- Steps -->
      <div
        class="fund_steps"
        *ngIf="!this.hasOwnerFunds"
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
      <div class="fl">
        <div *ngIf="this.hasOwnerFunds" class="fl__funds ion-padding">
          <div
            class="fl__funds__title ux-font-lato ux-fweight-semibold ux-fsize-12"
          >
            {{ 'funds.funds_list.funds_title' | translate }}
          </div>

          <div class="fl__funds__card" *ngFor="let fb of ownerFundBalances">
            <app-fund-card [fund]="fb"></app-fund-card>
          </div>
        </div>
        <div *ngIf="this.hasNotOwnerFunds" class="fl__funds ion-padding">
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

      <!-- Info -->
      <div class="academy ion-padding">
        <div
          class="academy__info__title ux-font-lato ux-fweight-semibold ux-fsize-12"
        >
          {{ 'funds.funds_list.info_title' | translate }}
        </div>
        <div
          class="academy__card_info_binance"
          *ngIf="this.status.profile_valid && !this.status.empty_linked_keys && !this.hasOwnerFunds"
        >
          <app-ux-card-info-binance></app-ux-card-info-binance>
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
  hasOwnerFunds = false;
  hasNotOwnerFunds = false;
  status = {
    profile_valid: false,
    empty_linked_keys: false
  };

  actionButton: {
    name: string;
    text: string;
  };

  steps: any;

  constructor(
    private apiFundsService: ApiFundsService,
    private translate: TranslateService,
    private apiUsuarios: ApiUsuariosService,
    private navController: NavController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.checkStatus();
    this.checkFunds();
  }

  ionViewDidEnter() {
    this.getOwnerFundBalances();
  }

  checkStatus() {
    this.apiUsuarios.status().subscribe(res => {
      this.status = res;
      this.setSteps();
      this.setActionButton();
    });
  }

  checkFunds() {
    this.apiFundsService.count().subscribe(res => {
      this.hasOwnerFunds = res.owners > 0;
      this.hasNotOwnerFunds = res.not_owners > 0;
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
    this.navController.navigateForward('profiles/user')
    // TODO: Implementar profile.
  }

  doActionButton() {
    if (!this.status.profile_valid) {
      this.navController.navigateRoot('profiles/personal-data');
    } else if (!this.status.empty_linked_keys) {
      this.navController.navigateRoot('apikeys/tutorial');
    } else {
      this.navController.navigateRoot('funds/fund-name');
    }
  }
}
