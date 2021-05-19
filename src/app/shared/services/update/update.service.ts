import { of } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

export abstract class UpdateService {
  protected constructor(protected alertController: AlertController, protected translate: TranslateService) {}

  protected expectedVersion: any;
  protected actualVersion: any;
  protected alertOfLevel: any = {
    RECOMMENDED: this.showRecommendedAlert,
    REQUIRED: this.showRequiredAlert,
    NO_REQUIRED: () => undefined,
  };

  protected abstract async getActualVersion();

  protected abstract async update();

  protected async showRecommendedAlert() {
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

  protected async showRequiredAlert() {
    // TODO: Show requried alert.
    console.log('Showing required alert');
  }

  protected async getExpectedVersion() {
    // TODO: replace of by server request
    this.expectedVersion = await of({ version: '1.1.0', level: 'RECOMMENDED' }).toPromise();
  }

  public async checkForUpdate() {
    await this.getExpectedVersion();
    await this.getActualVersion();
    if (this.actualVersion !== this.expectedVersion.version) {
      await this.alertOfLevel[this.expectedVersion.level]();
    }
  }
}
