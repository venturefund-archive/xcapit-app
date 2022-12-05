import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { CONFIG } from 'src/app/config/app-constants.config';
import { ApiProfilesService } from '../../../modules/profiles/shared-profiles/services/api-profiles/api-profiles.service';
import { DeviceInjectable } from '../../models/device/injectable/device.injectable';

const LNG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(
    private translate: TranslateService,
    private storage: Storage,
    private apiProfilesService: ApiProfilesService,
    private deviceInjectable: DeviceInjectable
  ) {}

  async setInitialAppLanguage() {
    this.translate.setDefaultLang(CONFIG.app.defaultLanguage);
    let lang = await this.storage.get(LNG_KEY)
    if (!lang) {
      lang = await this.getDeviceDefaultLanguage();
    }
    this.setLanguage(lang)
  }

  getLanguages() {
    return [
      { text: 'English', value: 'en' },
      { text: 'Español', value: 'es' },
      { text: 'Portuguese', value: 'pt' },
    ];
  }

  async getDeviceDefaultLanguage(): Promise<string> {
    const lang = await this.deviceInjectable.create().getLanguageCode()
    if (lang.value !== 'en' && lang.value !== 'es') {
      lang.value = 'en';
    }
    return lang.value
  }

  setLanguage(lng: string): void {
    this.translate.use(lng);
    this.storage.set(LNG_KEY, lng);
    this.setUserLanguage(lng);
  }

  private setUserLanguage(language: string): void {
    this.apiProfilesService.setLanguage(language).subscribe();
  }

  getSelectedLanguage(): Promise<any> {
    return this.storage.get(LNG_KEY);
  }
}
