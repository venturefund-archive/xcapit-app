import { TranslateService } from '@ngx-translate/core';

export function AppInitializerFactory(translate: TranslateService) {
  return () => {
    translate.setDefaultLang('es');
    return translate.use('es').toPromise();
  };
}
