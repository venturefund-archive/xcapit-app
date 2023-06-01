import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { SkipBackupModalComponent } from '../shared-wallets/components/skip-backup-modal/skip-backup-modal.component';
import { TrackedWalletAddressInjectable } from '../../../shared/models/tracked-wallet-address/injectable/tracked-wallet-address.injectable';
import { BACKUP_OPTIONS } from '../shared-wallets/constants/backup-options';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { GoogleAuthService } from 'src/app/shared/services/google-auth/google-auth.service';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { WalletPasswordWithValidatorComponent } from '../shared-wallets/components/wallet-password-with-validator/wallet-password-with-validator.component';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { asyncDelay } from '../../../shared/constants/async-delay';

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
          <app-user-register-step-card
            *ngFor="let step of this.steps"
            [step]="step"
            (cardClicked)="this.askForPassword()"
          ></app-user-register-step-card>
        </div>
        <div class="main__actions__secondary ion-padding">
          <ion-button
            *ngIf="!this.protectedWallet"
            appTrackClick
            name="ux_create_skip"
            class="link ux-link-xl"
            fill="clear"
            (click)="skipBackup()"
            >{{ 'wallets.success_creation.secondary_action.title' | translate }}</ion-button
          >
          <ion-button
            *ngIf="this.protectedWallet"
            class="ux_button"
            color="secondary"
            appTrackClick
            name="ux_finish_backup"
            expand="block"
            (click)="finish()"
            >{{ 'wallets.success_creation.finish_button' | translate }}</ion-button
          >
        </div>
      </div>
    </div>
  </ion-content>`,
  styleUrls: ['./success-creation.page.scss'],
})
export class SuccessCreationPage {
  steps = [];
  accessToken: string;
  protectedWallet: boolean;

  constructor(
    private trackService: TrackService,
    private modalController: ModalController,
    private trackedWalletAddress: TrackedWalletAddressInjectable,
    private storage: IonicStorageService,
    private googleAuthService: GoogleAuthService,
    private walletEncryptionService: WalletEncryptionService,
    private navController: NavController,
    private storageService: StorageService
  ) {}

  async ionViewWillEnter() {
    await this._setSteps();
    this.trackScreenViewEvent();
    this.trackWalletAddressEvent();
    await this.getWalletAddress();
    await this._setStepsStatus();
  }

  private async _isWalletProtected() {
    this.protectedWallet = await this.storage.get('protectedWallet');
    return this.protectedWallet;
  }

  private async _isWalletBackup() {
    return await this.storage.get('wallet_backup');
  }

  private async _isWarrantyWallet() {
    return await this.storage.get('warranty_wallet');
  }

  private async getWalletAddress() {
    const wallet = await this.storageService.getWalletFromStorage();
    this.googleAuthService.walletAddress = wallet.addresses.ERC20;
  }

  trackScreenViewEvent(): void {
    this.trackService.trackEvent({
      eventAction: 'screenview',
      description: window.location.href,
      eventLabel: 'ux_create_screenview_success',
    });
  }

  private async _setSteps() {
    let steps = structuredClone(BACKUP_OPTIONS);
    if (await this._isWarrantyWallet()) {
      steps = steps.filter((step) => step.order === '1');
    }
    this.steps = steps;
  }

  private async _setStepsStatus() {
    const stepOne = this.steps.find((step) => step.order === '1');
    const stepTwo = this.steps.find((step) => step.order === '2');
    if (await this._isWalletBackup()) {
      stepOne.completed = true;
      stepTwo.disabled = false;
    }
    if (await this._isWalletProtected()) {
      stepTwo.completed = true;
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

  async googleAuth() {
    this.accessToken = await this.googleAuthService.accessToken();
    const encryptedWallet = JSON.stringify(await this.walletEncryptionService.getEncryptedWallet());
    await this.createFile(encryptedWallet);
  }

  async createFile(encryptedWallet: string) {
    this.googleAuthService.createFile(this.accessToken, encryptedWallet).subscribe(async () => {
      await this.storage.set('wallet_backup', true);
      await this._setStepsStatus();
      await this.successModal();
    });
  }

  async askForPassword() {
    if (!(await this._isWalletBackup())) {
      const modal = await this.modalController.create({
        component: WalletPasswordWithValidatorComponent,
        cssClass: 'ux-routeroutlet-modal small-wallet-password-modal',
        componentProps: {
          title: 'wallets.success_creation.password_modal.title',
          description: 'wallets.success_creation.password_modal.description',
          submitButtonText: 'wallets.success_creation.password_modal.button_text',
        },
      });
      await modal.present();
      const { data } = await modal.onDidDismiss();
      await asyncDelay(500);
      if (data) {
        await this.googleAuth();
      }
    }
  }

  async successModal() {
    const modal = await this.modalController.create({
      component: SuccessModalComponent,
      backdropDismiss: false,
      componentProps: {
        title: 'wallets.success_creation.backup_succes_modal.title',
        description: 'wallets.success_creation.backup_succes_modal.description',
        buttonText: 'wallets.success_creation.backup_succes_modal.button_text',
      },
    });
    await modal.present();
  }

  finish() {
    this.navController.navigateForward('tabs/wallets');
  }
}
