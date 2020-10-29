import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
import { tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdatePWAService {

  constructor(
    private alertController: AlertController,
    private swUpdate: SwUpdate,
    private translate: TranslateService
  ) {
  }

  async showUpdateAppAlert() {
    const alert = await this.alertController.create({
      header: this.translate.instant('shared.services.update_pwa_service.alert_header'),
      message: this.translate.instant('shared.services.update_pwa_service.alert_message'),
      buttons: [
        {
          text: this.translate.instant('shared.services.update_pwa_service.alert_cancel_button'),
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: this.translate.instant('shared.services.update_pwa_service.alert_update_button'),
          handler: _ =>
            this.swUpdate
              .activateUpdate()
              .then(() => document.location.reload())
        }
      ]
    });
    await alert.present();
  }

  update(): Observable<UpdateAvailableEvent> {
    return this.swUpdate.available.pipe(tap(async _ => {
      await this.showUpdateAppAlert();
    }));
  }
}
