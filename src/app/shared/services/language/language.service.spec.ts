import { TestBed } from '@angular/core/testing';

import { LanguageService } from './language.service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { ApiUsuariosService } from '../../../modules/usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { of } from 'rxjs';

describe('LanguageService', () => {
  let translateServiceSpy: any;
  let storageSpy: any;
  let service: LanguageService;
  let apiUsuariosServiceSpy: jasmine.SpyObj<ApiUsuariosService>;

  beforeEach(() => {
    apiUsuariosServiceSpy = jasmine.createSpyObj('ApiUsuariosService', {
      setLanguage: of({}),
    });
    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use']);
    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set']);

    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: Storage, useValue: storageSpy },
        { provide: ApiUsuariosService, useValue: apiUsuariosServiceSpy },
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
    storageSpy.get.and.returnValue(new Promise(() => null));
    service.setInitialAppLanguage();
    expect(translateServiceSpy.setDefaultLang).toHaveBeenCalledTimes(1);
    expect(storageSpy.get).toHaveBeenCalledTimes(1);
  });

  it('should set language through api when set language', () => {
    service.setLanguage('es');
    expect(apiUsuariosServiceSpy.setLanguage).toHaveBeenCalledOnceWith('es');
  });
});
