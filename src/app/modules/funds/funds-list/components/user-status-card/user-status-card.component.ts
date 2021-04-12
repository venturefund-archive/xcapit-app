import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { TabsComponent } from '../../../../tabs/tabs/tabs.component';

@Component({
  selector: 'app-user-status-card',
  template: `
      <div
              class="user-status"
              *ngIf="
          this.userStatus.status_name != 'COMPLETE' &&
          this.userStatus.status_name != ''
        "
      >
          <div class="user-status ion-padding">
              <div class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22 user-status__title">
                  <ion-text>{{
                      'funds.funds_list.user_status.title' | translate
                      }}</ion-text>
              </div>
              <div class="user-status__img">
                  <img src="assets/img/fund-list/start-invest.svg" alt="Start invest">
              </div>
              <div class="user-status__buttons">
                  <ion-button
                          appTrackClick
                          [dataToTrack]="{ description: this.actionButtonName }"
                          name="Action Button"
                          class="ux_button"
                          type="button"
                          color="primary"
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
  styleUrls: ['./user-status-card.component.scss']
})
export class UserStatusCardComponent implements OnInit {
  @Input() userStatus: any;
  actionButtonName: string;
  newFundUrl: string;

  constructor(
    private translate: TranslateService,
    private navController: NavController,
    private tabsComponent: TabsComponent,
  ) {
  }

  ngOnInit() {
    this.setActionButtonName();
    this.setNewFundUrl();
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
    if (!this.userStatus.profile_valid) {
      this.newFundUrl = 'profiles/personal-data';
    } else if (!this.userStatus.empty_linked_keys) {
      this.newFundUrl = 'apikeys/tutorial';
    } else {
      this.newFundUrl = 'funds/fund-name';
    }
    this.tabsComponent.newFundUrl = this.newFundUrl;
  }

  doActionButton() {
    this.navController.navigateRoot(this.newFundUrl).then();
  }

}
