import { languageInitializer } from './language-initializer';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

describe('languageInitializer', () => {
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    translateServiceSpy = jasmine.createSpyObj('TranslateService', { setDefaultLang: null, use: of() });
  });

  it('should translate setDefaultLang be called with es', () => {
    languageInitializer(translateServiceSpy)();
    expect(translateServiceSpy.setDefaultLang).toHaveBeenCalledWith('es');
  });

  it('should translate user be called with es', () => {
    languageInitializer(translateServiceSpy)();
    expect(translateServiceSpy.use).toHaveBeenCalledWith('es');
  });
});
