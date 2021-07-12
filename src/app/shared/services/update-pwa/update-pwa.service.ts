import { Injectable } from '@angular/core';
import { UpdateService } from '../update/update.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SwUpdate } from '@angular/service-worker';
import { LoadingService } from '../loading/loading.service';
import { HttpClient } from '@angular/common/http';
import { version } from 'pwa/version';

@Injectable({
  providedIn: 'root',
})
export class UpdatePWAService extends UpdateService {
  constructor(
    alertController: AlertController,
    translate: TranslateService,
    http: HttpClient,
    private swUpdate: SwUpdate,
    private loadingService: LoadingService
  ) {
    super(alertController, translate, http);
  }

  update() {
    this.loadingService.show().then();
    this.swUpdate.activateUpdate().then(
      (_) => {
        this.loadingService.dismiss().then();
        document.location.reload();
      },
      (_) => this.loadingService.dismiss()
    );
  }

  async getActualVersion(): Promise<any> {
    return Promise.resolve(version.version);
  }
}
