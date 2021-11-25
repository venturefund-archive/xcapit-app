import { Injectable } from '@angular/core';
import { UpdateService } from '../update/update.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { App } from '@capacitor/app';
@Injectable({
  providedIn: 'root',
})
export class UpdateAppService extends UpdateService {
  app = App;

  constructor(alertController: AlertController, translate: TranslateService, http: HttpClient) {
    super(alertController, translate, http);
  }

  async getActualVersion(): Promise<any> {
    return await this.app.getInfo().then((res) => res.version);
  }

  protected async update(): Promise<any> {}
}
