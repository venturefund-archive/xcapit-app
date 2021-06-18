import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export abstract class UpdateService {
  protected constructor(
    private alertController: AlertController,
    private translate: TranslateService,
    private http: HttpClient
  ) {}

  protected expectedVersion: any;
  protected level: any;
  protected actualVersion: any;
  protected alertOfLevel: any = {
    RECOMMENDED: 'showRecommendedAlert',
    REQUIRED: 'showRequiredAlert',
    NO_REQUIRED: '',
  };

  protected abstract async getActualVersion();

  protected abstract async update();

  protected async showRecommendedAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('shared.services.update_service.alert_header'),
      message: this.translate.instant('shared.services.update_service.alert_message'),
      buttons: [
        {
          text: this.translate.instant('shared.services.update_service.alert_cancel_button'),
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: this.translate.instant('shared.services.update_service.alert_update_button'),
          handler: async (_) => this.update(),
        },
      ],
    });
    await alert.present();
  }

  protected async showRequiredAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('shared.services.update_service.alert_required_header'),
      message: this.translate.instant('shared.services.update_service.alert_required_text'),
      buttons: [
        {
          text: this.translate.instant('shared.services.update_service.alert_required_button'),
          handler: (_) => this.update(),
        },
      ],
      backdropDismiss: false,
    });
    await alert.present();
  }

  async getExpectedVersion(): Promise<any> {
    return this.http.get(`${environment.apiUrl}/app/version/`).toPromise();
  }

  public async checkForUpdate() {
    const { version, level } = await this.getExpectedVersion();
    this.expectedVersion = version;
    this.level = level;
    this.actualVersion = await this.getActualVersion();
    if (this.actualVersion !== this.expectedVersion) {
      if (this.alertOfLevel[this.level]) {
        this[this.alertOfLevel[this.level]]();
      }
    }
  }
}
