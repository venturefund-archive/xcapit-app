import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { WarningBackupModalComponent } from '../../components/warning-backup-modal/warning-backup-modal.component';

@Injectable({
  providedIn: 'root',
})
export class WalletBackupService {
  private showBackupWarning: boolean;
  private isWarningModalOpen = false;

  constructor(
    private modalController: ModalController,
    private remoteConfigService: RemoteConfigService,
    private ionicStorageService: IonicStorageService
  ) {}

  async presentModal(): Promise<string> {
    if (this.isWarningModalOpen) {
      return;
    }
    this.isWarningModalOpen = true;

    if (this.showBackupWarning) {
      const shouldChangeNavigation = await this.showWarningBackupModal();

      if (shouldChangeNavigation === 'skip') {
        await this.disableModal();
      }

      return shouldChangeNavigation;
    }
    this.isWarningModalOpen = false;
    return 'skip';
  }

  private async showWarningBackupModal(): Promise<string> {
    const modal = await this.modalController.create({
      component: WarningBackupModalComponent,
      componentProps: {},
      cssClass: 'modal',
      backdropDismiss: false,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.isWarningModalOpen = false;
    return data;
  }

  async getBackupWarningWallet(): Promise<void> {
    if (
      this.remoteConfigService.getFeatureFlag('ff_homeWalletBackupWarningModal') &&
      !(await this.ionicStorageService.get('protectedWallet'))
    ) {
      this.showBackupWarning = !!(await this.ionicStorageService.get('backupWarningWallet'));
    } else {
      this.disableModal();
    }
  }

  async enableModal(): Promise<void> {
    this.showBackupWarning = true;
    await this.ionicStorageService.set('backupWarningWallet', true);
  }

  async disableModal(): Promise<void> {
    this.showBackupWarning = false;
    await this.ionicStorageService.set('backupWarningWallet', false);
  }
}
