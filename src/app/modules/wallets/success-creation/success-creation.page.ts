import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { SkipBackupModalComponent } from '../shared-wallets/components/skip-backup-modal/skip-backup-modal.component';
import { TrackedWalletAddressInjectable } from '../../../shared/models/tracked-wallet-address/injectable/tracked-wallet-address.injectable';
import { BACKUP_OPTIONS, RawBackupOption } from '../shared-wallets/constants/backup-options';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { GoogleAuthService } from 'src/app/shared/services/google-auth/google-auth.service';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { WalletPasswordWithValidatorComponent } from '../shared-wallets/components/wallet-password-with-validator/wallet-password-with-validator.component';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';
import { asyncDelay } from '../../../shared/constants/async-delay';
import { StatusBackupStepOf } from '../shared-wallets/models/status-backup-step-of/status-backup-step-of';
import { DefaultBackupSteps } from '../shared-wallets/models/backup-steps/default/default-backup-steps';
import { BackupStepsDataRepo } from '../shared-wallets/models/backup-steps-data-repo/backup-steps-data-repo';
import { BackupStep } from '../shared-wallets/models/backup-step/backup-step';

@Component({
  selector: 'app-success-creation',
  template: ` <ion-content>
    <div class="header__ux_success_image">
      <img src="assets/img/wallets/success_creation.svg" />
    </div>
    <div class="main ion-padding" *ngIf="this.steps.length > 0">
      <div class="main__primary_text ux-font-text-xl" *ngIf="!this.steps[0].completed">
        <ion-text [innerHTML]="'wallets.success_creation.title' | translate"></ion-text>
      </div>
      <div class="main__primary_text ux-font-text-xl" *ngIf="this.steps[0].completed">
        <ion-text [innerHTML]="'wallets.success_creation.title1' | translate"></ion-text>
      </div>
      <div class="main__secondary_text ux-font-text-base" *ngIf="!this.steps[0].completed">
        <ion-text [innerHTML]="'wallets.success_creation.subtitle' | translate"></ion-text>
      </div>
      <div class="main__secondary_text ux-font-text-base" *ngIf="this.steps[0].completed && this.steps.length > 1 && !this.steps[1].completed">
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
            *ngIf="!this.completed"
            appTrackClick
            name="ux_create_skip"
            class="link ux-link-xl"
            fill="clear"
            (click)="this.skipBackup()"
            >{{ 'wallets.success_creation.secondary_action.title' | translate }}</ion-button
          >
          <ion-button
            *ngIf="this.completed"
            class="ux_button"
            color="secondary"
            appTrackClick
            name="ux_finish_backup"
            expand="block"
            (click)="this.finish()"
            >{{ 'wallets.success_creation.finish_button' | translate }}</ion-button
          >
        </div>
      </div>
    </div>
  </ion-content>`,
  styleUrls: ['./success-creation.page.scss'],
})
export class SuccessCreationPage {
  steps: RawBackupOption[] = [];
  accessToken: string;
  completed = false;

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
    this.trackScreenViewEvent();
    this.trackWalletAddressEvent();
    await this.getWalletAddress();
    await this._setStepsStatus();
    await this.setCompleted();
  }

  private async setCompleted() {
    this.completed = (await this._isWalletBackup()) && (await this._isWalletProtected());
  }

  private async _isWalletProtected() {
    return await this.storage.get('protectedWallet');
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

  private async _backupSteps(): Promise<BackupStep[]> {
    const result = new DefaultBackupSteps(new BackupStepsDataRepo(structuredClone(BACKUP_OPTIONS)));
    return (await this._isWarrantyWallet()) ? result.warranty() : result.all();
  }
  private async _setStepsStatus() {
    this.steps = new StatusBackupStepOf(
      await this._backupSteps(),
      await this._isWalletBackup(),
      await this._isWalletProtected()
    ).json();
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
    await this.googleAuthService.createFile(this.accessToken, encryptedWallet).toPromise();
    await this.storage.set('wallet_backup', true);
    await this._setStepsStatus();
    if (await this._isWarrantyWallet()) {
      this.completed = true;
    }
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

  finish() {
    this.navController.navigateForward('tabs/wallets');
  }
}
