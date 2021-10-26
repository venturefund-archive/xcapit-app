import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { CONFIG } from 'src/app/config/app-constants.config';
import { ApiUsuariosService } from '../../../modules/usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';

const LNG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  selected = '';

  constructor(
    private translate: TranslateService,
    private storage: Storage,
    private apiUsuariosService: ApiUsuariosService
  ) {}

  setInitialAppLanguage() {
    this.translate.setDefaultLang(CONFIG.app.defaultLanguage);
    this.selected = CONFIG.app.defaultLanguage;
    this.storage.get(LNG_KEY).then((val) => {
      if (val) {
        this.setLanguage(val);
      }
    });
  }

  getLanguages() {
    return [
      { text: 'English', value: 'en' },
      { text: 'Español', value: 'es' },
    ];
  }

  setLanguage(lng: string) {
    this.translate.use(lng);
    this.selected = lng;
    this.storage.set(LNG_KEY, lng);
    this.setUserLanguage(lng);
  }

  private setUserLanguage(language: string) {
    this.apiUsuariosService.setLanguage(language).subscribe();
  }
}
