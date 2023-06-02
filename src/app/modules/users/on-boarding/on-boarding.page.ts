import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { AuthService } from '../shared-users/services/auth/auth.service';
import { SimplifiedWallet } from '../../wallets/shared-wallets/models/simplified-wallet/simplified-wallet';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
@Component({
  selector: 'app-on-boarding',
  template: `
    <div class="ob">
      <app-xcapit-logo divClass="ob__logo" [whiteLogo]="true"></app-xcapit-logo>
      <div class="ob__content">
        <img class="ob__content__img" [src]="'assets/img/on-boarding/slide-icon.svg'" />
        <ion-text class="ob__content__title ux-font-num-titulo">
          {{ 'users.on_boarding.title' | translate }}
        </ion-text>
        <ion-text class="ob__content__description ux-font-text-base">
          {{ 'users.on_boarding.description' | translate }}
        </ion-text>
      </div>

      <div class="ob__actions">
        <ion-button
          (click)="this.goToCreate()"
          name="Create wallet"
          expand="block"
          size="large"
          class="ux_button"
          color="secondary"
        >
          {{ 'users.on_boarding.primary_action' | translate }}
        </ion-button>
        <ion-button
          (click)="this.goToImport()"
          name="Import wallet"
          expand="block"
          size="large"
          class="ob__actions__secondary ux-link-xl"
          fill="clear"
        >
          {{ 'users.on_boarding.secondary_action' | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./on-boarding.page.scss'],
})
export class OnBoardingPage {
  constructor(
    private navController: NavController,
    private trackService: TrackService,
    private authService: AuthService,
    private ionicStorageService: IonicStorageService
  ) {}

  ionViewWillEnter() {
    this.removeOldToken();
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_onboarding_screenview',
    });
  }

  private removeOldToken(): void {
    this.authService.logout();
  }

  goToCreate() {
    this.navController.navigateForward('/wallets/select-wallet-type');
  }

  async goToImport() {
    await this._resetWalletType();
    this.navController.navigateForward('/wallets/create-first/disclaimer/import');
  }

  private async _resetWalletType() {
    await new SimplifiedWallet(this.ionicStorageService).save(false);
  }
}
