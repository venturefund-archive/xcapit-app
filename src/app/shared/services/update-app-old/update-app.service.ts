import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { CustomHttpService } from '../custom-http/custom-http.service';
import { PlatformService } from '../platform/platform.service';
import { Plugins } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class UpdateAppService {
  device = Plugins.Device;
  nativeMarket = Plugins.NativeMarket;

  constructor(
    private alertController: AlertController,
    private translate: TranslateService,
    private http: CustomHttpService,
    private platformService: PlatformService
  ) {}

  async showRecommendedAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('shared.services.update_pwa_service.alert_header'),
      message: this.translate.instant('shared.services.update_pwa_service.alert_message'),
      buttons: [
        {
          text: this.translate.instant('shared.services.update_pwa_service.alert_cancel_button'),
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: this.translate.instant('shared.services.update_pwa_service.alert_update_button'),
          handler: async (_) => this.update(),
        },
      ],
    });
    await alert.present();
  }

  getExpectedVersion() {
    // TODO: replace of by server request
    return of({ version: '1.1.0', level: 'RECOMMENDED' });
  }

  isNativePlatform() {
    return this.platformService.isNative();
  }

  showRequiredAlert() {
    // TODO: Show required alert
  }

  async showAlert(level) {
    if (level === 'RECOMMENDED') {
      await this.showRecommendedAlert();
    } else if (level === 'REQUIRED') {
      await this.showRequiredAlert();
    }
  }

  async checkVersion({ version, level }) {
    const { appVersion } = await this.device.getInfo();
    console.log('VERSION: ', appVersion, ' RECOMMENDED ', version);
    if (appVersion !== version) {
      await this.showAlert(level);
    }
  }

  async update() {
    const { appId } = await this.device.getInfo();
    this.nativeMarket.openStoreListing({ appId });
  }

  checkForUpdate() {
    if (this.isNativePlatform()) {
      this.getExpectedVersion().subscribe(async (res) => this.checkVersion(res));
    }
  }
}
