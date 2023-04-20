import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { SkipBackupModalComponent } from '../shared-wallets/components/skip-backup-modal/skip-backup-modal.component';
import { TrackedWalletAddressInjectable } from '../../../shared/models/tracked-wallet-address/injectable/tracked-wallet-address.injectable';
import { BACKUP_OPTIONS } from '../shared-wallets/constants/backup-options';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

@Component({
  selector: 'app-success-creation',
  template: ` <ion-content>
    <div class="header__ux_success_image">
      <img src="assets/img/wallets/success_creation.svg" />
    </div>
    <div class="main ion-padding">
      <div class="main__primary_text ux-font-text-xl" *ngIf="!this.steps[0].completed">
        <ion-text [innerHTML]="'wallets.success_creation.title' | translate"></ion-text>
      </div>
      <div class="main__primary_text ux-font-text-xl" *ngIf="this.steps[0].completed">
        <ion-text [innerHTML]="'wallets.success_creation.title1' | translate"></ion-text>
      </div>
      <div class="main__secondary_text ux-font-text-base" *ngIf="!this.steps[0].completed">
        <ion-text [innerHTML]="'wallets.success_creation.subtitle' | translate"></ion-text>
      </div>
      <div class="main__secondary_text ux-font-text-base" *ngIf="this.steps[0].completed">
        <ion-text [innerHTML]="'wallets.success_creation.subtitle1' | translate"></ion-text>
      </div>
      <div class="main__actions">
        <div class="main__actions__backup-options">
          <app-user-register-step-card *ngFor="let step of this.steps" [step]="step"> </app-user-register-step-card>
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
  steps = structuredClone(BACKUP_OPTIONS);

  constructor(
    private trackService: TrackService,
    private modalController: ModalController,
    private trackedWalletAddress: TrackedWalletAddressInjectable,
    private storage: IonicStorageService
  ) {}

  async ionViewWillEnter() {
    this.trackScreenViewEvent();
    this.trackWalletAddressEvent();
    this.setStepsState();
  }

  isWalletProtected() {
    return this.storage.get('protectedWallet');
  }

  trackScreenViewEvent(): void {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_create_screenview_success',
    });
  }

  async setStepsState() {
    const stepOne = this.steps.find((step) => step.order === '1');
    const stepTwo = this.steps.find((step) => step.order === '2');
    if (await this.isWalletProtected()) {
      stepOne.completed = true;
      stepTwo.disabled = false;
    }
  }

  trackWalletAddressEvent() {
    this.trackedWalletAddress.create().value();
  }

  async skipBackup() {
    const modal = await this.modalController.create({
      component: SkipBackupModalComponent,
      cssClass: 'modal',
      backdropDismiss: false,
    });
    await modal.present();
  }
}
