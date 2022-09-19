import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-remove-account-modal',
  template: `
    <div class="ram">
      <div class="ion-padding ram__content">
        <div class="ram__content__title">
          <ion-text class="ux-font-text-lg">{{ 'profiles.shared.remove_account_modal.title' | translate }}</ion-text>
        </div>
        <div class="ram__content__text">
          <ion-text
            class="ux-font-text-base"
            [innerHTML]="'profiles.shared.remove_account_modal.text' | translate"
          ></ion-text>
        </div>
        <div class="ram__content__more-info">
          <ion-text class="ux-font-text-base" color="neutral80">{{
            'profiles.shared.remove_account_modal.more_info' | translate
          }}</ion-text>
          <ion-button
            appTrackClick
            (click)="this.goToFAQ()"
            name="wallet_faqs"
            class="ux-link-xs ion-no-padding ion-no-margin"
            fill="clear"
          >
            {{ 'profiles.shared.remove_account_modal.more_info_link' | translate }}
          </ion-button>
        </div>
      </div>
      <div class="ram__button">
        <ion-button
          appTrackClick
          (click)="this.removeAccount()"
          color="dangerdark"
          name="remove_account_button"
          class="ux_button"
          fill="clear"
          >{{ 'profiles.shared.remove_account_modal.remove_account_button' | translate }}</ion-button
        >
      </div>
      <div class="ram__button">
        <ion-button
          appTrackClick
          (click)="this.cancel()"
          color="neutral80"
          name="cancel_button"
          class="ux_button"
          fill="clear"
          >{{ 'profiles.shared.remove_account_modal.cancel_button' | translate }}</ion-button
        >
      </div>
    </div>
  `,
  styleUrls: ['./remove-account-modal.component.scss'],
})
export class RemoveAccountModalComponent implements OnInit {
  constructor(private navController: NavController, private modalController: ModalController) {}

  ngOnInit() {}

  goToFAQ() {
    this.modalController.dismiss(false);
    this.navController.navigateForward(['/support/faqs/wallet']);
  }

  removeAccount() {
    this.modalController.dismiss(true);
  }

  async cancel() {
    await this.modalController.dismiss(false);
  }
}
