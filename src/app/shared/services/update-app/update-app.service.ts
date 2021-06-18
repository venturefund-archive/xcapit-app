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
  nativeMarket = Plugins.NativeMarket;

  constructor(alertController: AlertController, translate: TranslateService, http: HttpClient) {
    super(alertController, translate, http);
  }

  async getActualVersion(): Promise<any> {
    return await this.device.getInfo().then((res) => res.appVersion);
  }

  protected async update(): Promise<any> {
    const { appId } = await this.device.getInfo();
    this.nativeMarket.openStoreListing({ appId });
  }
}
