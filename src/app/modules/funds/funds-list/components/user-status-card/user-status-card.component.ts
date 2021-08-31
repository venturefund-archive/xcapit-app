import { Component, Input, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';

@Component({
  selector: 'app-user-status-card',
  template: `
    <div class="user-status" *ngIf="this.userStatus.status_name !== 'COMPLETE' && this.userStatus.status_name !== ''">
      <div class="user-status ion-padding">
        <div *ngIf="this.notOwnerFundBalances" class="type-toggle">
          <a (click)="this.hideText()">
            <ion-icon class="eye-button" [hidden]="!this.hideFundText" name="eye-off-outline"></ion-icon>
            <ion-icon class="eye-button" [hidden]="this.hideFundText" name="eye-outline"></ion-icon>
          </a>
        </div>
        <div class="ux-font-text-xl user-status__title">
          <ion-text>{{ 'funds.funds_list.user_status.title' | translate }}</ion-text>
        </div>

        <div class="user-status__img">
          <img src="assets/img/fund-list/start-invest.svg" alt="Start invest" />
        </div>
        <div class="user-status__buttons">
          <ion-button
            appTrackClick
            [dataToTrack]="{ description: this.actionButtonName }"
            name="Action Button"
            class="ux_button"
            type="button"
            color="uxsecondary"
            expand="block"
            size="medium"
            (click)="this.doActionButton()"
          >
            {{ 'funds.funds_list.user_status.action_button' | translate }}
          </ion-button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./user-status-card.component.scss'],
})
export class UserStatusCardComponent implements OnInit {
  @Input() userStatus: any;
  @Input() notOwnerFundBalances: any;

  actionButtonName: string;
  newFundUrl: string;
  hideFundText: boolean;

  constructor(private navController: NavController, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.setActionButtonName();
    this.setNewFundUrl();
  }

  async hideText() {
    this.localStorageService.toggleHideFunds();
  }

  setActionButtonName() {
    if (!this.userStatus.profile_valid) {
      this.actionButtonName = 'Configure Account';
    } else if (!this.userStatus.empty_linked_keys) {
      this.actionButtonName = 'Link with Binance';
    } else {
      this.actionButtonName = 'Create New Fund';
    }
  }

  setNewFundUrl() {
    if (this.userStatus.status_name === 'CREATOR' || this.userStatus.status_name === 'COMPLETE') {
      this.newFundUrl = 'apikeys/list';
    } else {
      this.newFundUrl = 'apikeys/tutorial';
    }
  }

  doActionButton() {
    this.navController.navigateRoot(this.newFundUrl).then();
  }
}
