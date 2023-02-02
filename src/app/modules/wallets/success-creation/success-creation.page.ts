import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { SkipBackupModalComponent } from '../shared-wallets/components/skip-backup-modal/skip-backup-modal.component';
import { TrackedWalletAddressInjectable } from '../../../shared/models/tracked-wallet-address/injectable/tracked-wallet-address.injectable';

@Component({
  selector: 'app-success-creation',
  template: ` <ion-content>
    <div class="header__ux_success_image">
      <img src="assets/img/wallets/success_creation.svg" />
    </div>
    <div class="main ion-padding">
      <div class="main__primary_text ux-font-text-xl">
        <ion-text [innerHTML]="'wallets.success_creation.title' | translate"></ion-text>
      </div>
      <div class="main__secondary_text ux-font-text-base">
        <ion-text [innerHTML]="'wallets.success_creation.subtitle' | translate"></ion-text>
      </div>
      <div class="main__actions">
        <div
          class="main__actions__primary"
          (click)="goToProtectWallet()"
          appTrackClick
          [dataToTrack]="{ eventLabel: 'ux_go_to_protect' }"
        >
          <div class="main__actions__primary__ribbon">
            <ion-label class="ux-font-num-subtitulo" color="successdark">{{
              'wallets.success_creation.ribbon_recommended' | translate
            }}</ion-label>
          </div>
          <ion-icon class="main__actions__primary__key-icon" name="ux-key-outline" color="info"> </ion-icon>
          <ion-label
            ><span class="ux-font-text-lg">{{ 'wallets.success_creation.primary_action.title' | translate }}</span
            ><br />
            <span class="ux-font-text-xxs subtitle">{{
              'wallets.success_creation.primary_action.subtitle' | translate
            }}</span>
          </ion-label>
          <ion-icon class="main__actions__primary__chevron-forward-icon" name="chevron-forward-outline" color="info">
          </ion-icon>
        </div>
        <div class="main__actions__secondary">
          <ion-button appTrackClick name="ux_create_skip" class="link ux-link-xl" fill="clear" (click)="skipBackup()">{{
            'wallets.success_creation.secondary_action.title' | translate
          }}</ion-button>
        </div>
      </div>
    </div>
  </ion-content>`,
  styleUrls: ['./success-creation.page.scss'],
})
export class SuccessCreationPage {
  constructor(
    private navController: NavController,
    private trackService: TrackService,
    private modalController: ModalController,
    private trackedWalletAddress: TrackedWalletAddressInjectable
  ) {}

  ionViewWillEnter() {
    this.trackScreenViewEvent();
    this.trackWalletAddressEvent();
  }

  trackScreenViewEvent(): void {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_create_screenview_success',
    });
  }

  trackWalletAddressEvent() {
    this.trackedWalletAddress.create().value();
  }

  async skipBackup() {
    const modal = await this.modalController.create({
      component: SkipBackupModalComponent,
      componentProps: {},
      cssClass: 'modal',
      backdropDismiss: false,
    });
    await modal.present();
  }

  goToProtectWallet() {
    this.navController.navigateForward(['/wallets/recovery/read']);
  }
}
