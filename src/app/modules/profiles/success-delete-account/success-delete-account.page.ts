import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { LoggedIn } from '../../users/shared-users/models/logged-in/logged-in';
import { AuthService } from '../../users/shared-users/services/auth/auth.service';
import { DeleteAccountDataService } from '../shared-profiles/services/delete-account-data/delete-account-data.service';

@Component({
  selector: 'app-success-delete-account',
  template: `<ion-content class="sda ion-padding-start ion-padding-end">
    <div class="sda__button_content">
      <ion-button class="sda__close_button" appTrackClick fill="clear" name="close" (click)="this.actions()">
        <ion-icon class="sda__close_button__icon" name="ux-close" color="neutral80"></ion-icon>
      </ion-button>
    </div>
    <div class="ux_main">
      <div class="ux_content">
        <div class="sda__img_container">
          <img class="sda__img_container__img" src="assets/img/delete-account/desk.svg" />
        </div>
        <div class="sda__content">
          <div class="ux-font-text-xl title">
            <ion-text>{{ 'profiles.delete_account.success.title' | translate }}</ion-text>
          </div>
          <div>
            <ion-text class="ux-font-text-base-black subtitle">{{ this.message }}</ion-text>
          </div>
        </div>
      </div>
    </div></ion-content
  >`,
  styleUrls: ['./success-delete-account.page.scss'],
})
export class SuccessDeleteAccountPage {
  message: string;

  constructor(
    private navController: NavController,
    private ionicStorageService: IonicStorageService,
    private authService: AuthService,
    private deleteAccountDataService: DeleteAccountDataService,
    private trnslate: TranslateService
  ) {}

  ionViewWillEnter() {
    this.message = this.trnslate.instant('profiles.delete_account.success.message', {
      email: this.deleteAccountDataService.email,
    });
  }

  actions() {
    this.logout();
  }

  async logout() {
    await new LoggedIn(this.ionicStorageService).save(false);
    await this.authService.logout();
    await this.navController.navigateRoot('users/login-new');
  }
}
