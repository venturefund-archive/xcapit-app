import { Injectable } from '@angular/core';
import { UpdateService } from '../update/update.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SwUpdate } from '@angular/service-worker';
import { LoadingService } from '../loading/loading.service';

@Injectable({
  providedIn: 'root',
})
export class UpdatePWAService extends UpdateService {
  constructor(
    protected alertController: AlertController,
    protected translate: TranslateService,
    private swUpdate: SwUpdate,
    private loadingService: LoadingService
  ) {
    super(alertController, translate);
  }

  update() {
    console.log('EXECUTING PWA update');
    this.loadingService.show().then();
    this.swUpdate.activateUpdate().then(() => {
      this.loadingService.dismiss().then();
      document.location.reload();
    });
  }

  protected async getActualVersion() {
    console.log('EXECUTING PWA getActualVersion');
    this.actualVersion = Promise.resolve('1.2.1');
  }
}
