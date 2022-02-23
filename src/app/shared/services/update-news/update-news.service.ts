import { Injectable } from '@angular/core';
import { App, AppInfo } from '@capacitor/app';
import { ModalController } from '@ionic/angular';
import { CONFIG } from 'src/app/config/app-constants.config';
import { AppStorageService } from '../app-storage/app-storage.service';
import { AuthService } from '../../../modules/usuarios/shared-usuarios/services/auth/auth.service';
import { UpdateNewsComponent } from '../../components/update-news/update-news.component';
import { PlatformService } from '../platform/platform.service';

@Injectable({
  providedIn: 'root',
})
export class UpdateNewsService {
  app = App;

  constructor(
    private modalController: ModalController,
    private storage: AppStorageService,
    private authService: AuthService,
    private platformService: PlatformService
  ) {}

  async getActualVersion(): Promise<string> {
    return await this.app.getInfo().then((res: AppInfo) => res.version);
  }

  async updated(): Promise<boolean> {
    const version = await this.getActualVersion();
    const storageVersion = await this.storage.get(CONFIG.app.storageVersionKey);
    return storageVersion === version;
  }

  async loggedIn(): Promise<boolean> {
    return await this.authService.checkToken();
  }

  async showModal(): Promise<void> {
    if (this.isNativePlatform() && !(await this.updated()) && (await this.loggedIn())) {
      const modal = await this.modalController.create({
        component: UpdateNewsComponent,
        cssClass: 'no-full-screen-modal',
      });
      await modal.present();
      await this.saveVersion();
    }
  }

  async saveVersion() {
    await this.storage.set(CONFIG.app.storageVersionKey, await this.getActualVersion());
  }

  isNativePlatform(): boolean {
    return this.platformService.isNative();
  }
}
