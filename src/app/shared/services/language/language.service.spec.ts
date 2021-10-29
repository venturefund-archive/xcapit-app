import { TestBed } from '@angular/core/testing';

import { LanguageService } from './language.service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { of } from 'rxjs';
import { ApiProfilesService } from '../../../modules/profiles/shared-profiles/services/api-profiles/api-profiles.service';

describe('LanguageService', () => {
  let translateServiceSpy: any;
  let storageSpy: any;
  let service: LanguageService;
  let apiProfilesServiceSpy: jasmine.SpyObj<ApiProfilesService>;

  beforeEach(() => {
    apiProfilesServiceSpy = jasmine.createSpyObj('ApiProfilesService', {
      setLanguage: of({}),
    });
    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use']);
    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set']);

    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: Storage, useValue: storageSpy },
        { provide: ApiProfilesService, useValue: apiProfilesServiceSpy },
      ],
    });
    service = TestBed.inject(LanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an objects array', () => {
    const result = service.getLanguages();
    expect(result).toBeTruthy();
    expect(Array.isArray(result)).toBeTruthy();
  });

  it('should set property selected on call setLanguage', () => {
    service.setLanguage('es');
    expect(service.selected).toBe('es');
  });

  it('should call setDefaultLang on translate and get on Storage when setInitialAppLanguage', () => {
    storageSpy.get.and.resolveTo(() => null);
    service.setInitialAppLanguage();
    expect(translateServiceSpy.setDefaultLang).toHaveBeenCalledTimes(1);
    expect(storageSpy.get).toHaveBeenCalledTimes(1);
  });

  it('should set language through api when set language', () => {
    service.setLanguage('es');
    expect(apiProfilesServiceSpy.setLanguage).toHaveBeenCalledOnceWith('es');
  });
});
