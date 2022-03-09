import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-log-out-modal',
  template: `
  <div class="ux-card lom">
    <div class="ion-padding lom__content">
      <div class="lom__content__title">
        <ion-text class="ux-font-text-lg">{{ 'profiles.user_profile_menu.log_out_modal.title' | translate }}</ion-text>
      </div>
      <div class="lom__content__text">
        <ion-text class="ux-font-text-base">{{ 'profiles.user_profile_menu.log_out_modal.text' | translate }}</ion-text>
      </div>
      <div class="lom__content__more-info">
        <ion-text class="ux-font-text-base">{{ 'profiles.user_profile_menu.log_out_modal.more_info' | translate }}</ion-text><br>
        <ion-button class="ux-link-xs ion-no-padding ion-no-margin" fill="clear">
          {{ 'profiles.user_profile_menu.log_out_modal.more_info_link' | translate }}
        </ion-button>
      </div>
      <div class="lom__content__checkbox">
        <ion-item class="ion-no-padding ion-no-margin" lines="none">
          <ion-checkbox mode="md" slot="start"></ion-checkbox>
          <ion-label class="ux-font-text-base">{{ 'profiles.user_profile_menu.log_out_modal.checkbox_label' | translate }}</ion-label>
        </ion-item>
      </div>
    </div>
    <div class="lom__close-button">
      <ion-button class="ux_button" fill="clear">{{ 'profiles.user_profile_menu.log_out_modal.log_out_button' | translate }}</ion-button>
    </div>
  </div>
  `,
  styleUrls: ['./log-out-modal.component.scss'],
})
export class LogOutModalComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
