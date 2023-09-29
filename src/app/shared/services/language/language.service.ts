import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage-angular';
import { CONFIG } from 'src/app/config/app-constants.config';
import { DeviceInjectable } from '../../models/device/injectable/device.injectable';

const LNG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(
    private translate: TranslateService,
    private storage: Storage,
    private deviceInjectable: DeviceInjectable
  ) {}

  async setInitialAppLanguage() {
    this.translate.setDefaultLang(CONFIG.app.defaultLanguage);
    let userSelectedlanguage = await this.storage.get(LNG_KEY);
    const lang = userSelectedlanguage ?? (await this.getDeviceDefaultLanguage());
    this.setLanguage(lang);
  }

  getLanguages() {
    return [
      { text: 'English', value: 'en' },
      { text: 'Español', value: 'es' },
      { text: 'Portuguese', value: 'pt' },
    ];
  }

  async getDeviceDefaultLanguage(): Promise<string> {
    const lang = await this.deviceInjectable.create().getLanguageCode();
    if (lang.value !== 'en' && lang.value !== 'es' && lang.value !== 'pt') {
      lang.value = 'en';
    }
    return lang.value;
  }

  setLanguage(language: string): void {
    this.translate.use(language);
    this.storage.set(LNG_KEY, language);
  }

  getSelectedLanguage(): Promise<any> {
    return this.storage.get(LNG_KEY);
  }
}
