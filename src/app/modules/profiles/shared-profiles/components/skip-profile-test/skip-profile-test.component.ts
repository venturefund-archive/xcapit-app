import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-skip-profile-test',
  template: `<div class="main__body">
    <div class="main__body__content">
      <div class="main__body__content__title">
        <ion-label class= "ux-font-text-lg"
          >{{ 'profiles.shared_profiles.skip_profile_test.title' | translate }}
        </ion-label>
      </div>
      <div class="main__body__content__description">
        <ion-label color="neutral90" class="ux-font-text-base ion-no-margin">
          {{ 'profiles.shared_profiles.skip_profile_test.description' | translate }}
        </ion-label>
      </div>
    </div>
    <div class="main__actions">
      <ion-button
        class="ux-link-xl main__actions__button main__actions__button-back"
        fill="clear"
        name="cancel_skip_test"
        (click)="close()"
      >
        {{ 'profiles.shared_profiles.skip_profile_test.button_back' | translate }}
      </ion-button>
      <ion-button
        class="ux-link-xl main__actions__button"
        fill="clear"
        name="out_skip_test"
        appTrackClick
        type="submit"
        (click)="this.handleSubmit()"
      >
        {{ 'profiles.shared_profiles.skip_profile_test.button_out' | translate }}
      </ion-button>
    </div>
  </div>`,
  styleUrls: ['./skip-profile-test.component.scss'],
})
export class SkipProfileTestComponent implements OnInit {
  homeWalletUrl = '/tabs/wallets'
  constructor(private modalController: ModalController, 
  private navController: NavController) {}

  ngOnInit() {}

  handleSubmit() {
    this.close();
    this.navController.navigateRoot([this.homeWalletUrl]);
  }

  close() {
    this.modalController.dismiss();
  }
}
