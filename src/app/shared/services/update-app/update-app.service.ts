import { Injectable } from '@angular/core';
import { UpdateService } from '../update/update.service';
import { ModalController } from '@ionic/angular';
import { AppUpdate, AppUpdateAvailability } from '@robingenz/capacitor-app-update';
import { RemoteConfigService } from '../remote-config/remote-config.service';
@Injectable({
  providedIn: 'root',
})
export class UpdateAppService extends UpdateService {
  appUpdate = AppUpdate;

  constructor(
    modalController: ModalController,
    remoteConfigService: RemoteConfigService
  ) {
    super(modalController, remoteConfigService);
  }

  public async update(): Promise<void> {
    return this.appUpdate.openAppStore();
  }

  async handleCheckForUpdate(): Promise<void> {
    const updateAvailability = (await this.appUpdate.getAppUpdateInfo()).updateAvailability;

    if (updateAvailability == AppUpdateAvailability.UPDATE_AVAILABLE) {
      this.showRecommendedModal();
    }
  }
}
