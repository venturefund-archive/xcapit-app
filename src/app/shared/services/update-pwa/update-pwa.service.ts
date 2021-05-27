import { Injectable } from '@angular/core';
import { UpdateService } from '../update/update.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SwUpdate } from '@angular/service-worker';
import { LoadingService } from '../loading/loading.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
// import version from 'pwa/version.json';

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
    console.log('alert ', alertController);
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
    // TODO: import json
    // this.actualVersion = Promise.resolve(version.version);
    this.actualVersion = await of('1.9.0').toPromise();
  }
}
