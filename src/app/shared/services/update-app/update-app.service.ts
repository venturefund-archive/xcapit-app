import { Injectable } from '@angular/core';
import { UpdateService } from '../update/update.service';
import { Plugins } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UpdateAppService extends UpdateService {
  device = Plugins.Device;

  constructor(alertController: AlertController, translate: TranslateService, http: HttpClient) {
    super(alertController, translate, http);
  }

  protected async getActualVersion() {
    console.log('EXECUTING APP getActualVersion');
    this.actualVersion = await this.device.getInfo();
  }

  protected async update(): Promise<any> {
    console.log('EXECUTING APP update');
    return Promise.resolve(undefined);
  }

  protected async showRequiredAlert(): Promise<any> {
    console.log('EXECUTING APP showRequiredAlert');
    return Promise.resolve(undefined);
  }
}
