import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { CONFIG } from 'src/app/config/app-constants.config';
import { ApiProfilesService } from '../../../modules/profiles/shared-profiles/services/api-profiles/api-profiles.service';

const LNG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(
    private translate: TranslateService,
    private storage: Storage,
    private apiProfilesService: ApiProfilesService
  ) {}

  setInitialAppLanguage() {
    this.translate.setDefaultLang(CONFIG.app.defaultLanguage);
    this.storage.get(LNG_KEY).then((lang) => {
      this.setLanguage(lang ? lang : this.getBrowserDefaultLanguage());
    });
  }

  getLanguages() {
    return [
      { text: 'English', value: 'en' },
      { text: 'Español', value: 'es' },
      { text: 'Portuguese', value: 'pt' },
    ];
  }

  getBrowserDefaultLanguage(): string {
    return navigator.language === 'es-ES' ? 'es' : 'en';
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
