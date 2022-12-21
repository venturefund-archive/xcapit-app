import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LanguageService } from './language.service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { of } from 'rxjs';
import { ApiProfilesService } from '../../../modules/profiles/shared-profiles/services/api-profiles/api-profiles.service';
import { DeviceInjectable } from '../../models/device/injectable/device.injectable';
import { FakeDevice } from '../../models/device/fake/fake-device';

describe('LanguageService', () => {
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  let storageSpy: jasmine.SpyObj<Storage>;
  let service: LanguageService;
  let apiProfilesServiceSpy: jasmine.SpyObj<ApiProfilesService>;
  let deviceInjectableSpy: jasmine.SpyObj<DeviceInjectable>;
  let fakeDevice: FakeDevice;

  beforeEach(() => {
    apiProfilesServiceSpy = jasmine.createSpyObj('ApiProfilesService', {
      setLanguage: of({}),
    });
    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use']);
    storageSpy = jasmine.createSpyObj('Storage', {
      get: Promise.resolve('en'),
      set: Promise.resolve(),
    });
    fakeDevice = new FakeDevice(Promise.resolve({ value: 'en' }));
    deviceInjectableSpy = jasmine.createSpyObj('fakeDevice', {
      create: fakeDevice,
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: Storage, useValue: storageSpy },
        { provide: ApiProfilesService, useValue: apiProfilesServiceSpy },
        { provide: DeviceInjectable, useValue: deviceInjectableSpy },
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

  it('should set previously selected language on setInitialAppLanguage', fakeAsync(() => {
    service.setInitialAppLanguage();
    tick();

    expect(translateServiceSpy.setDefaultLang).toHaveBeenCalledOnceWith('es');
    expect(translateServiceSpy.use).toHaveBeenCalledOnceWith('en');
    expect(storageSpy.set).toHaveBeenCalledOnceWith('SELECTED_LANGUAGE', 'en');
    expect(apiProfilesServiceSpy.setLanguage).toHaveBeenCalledOnceWith('en');
  }));

  it('should default to english when device language is not a selectable app language on setInitialAppLanguage when there is no selected language', fakeAsync(() => {
    storageSpy.get.and.returnValue(Promise.resolve(undefined));
    const deviceResponse = new FakeDevice(Promise.resolve({ value: 'xx' }));
    deviceInjectableSpy.create.and.returnValue(deviceResponse);
    service.setInitialAppLanguage();
    tick();

    expect(translateServiceSpy.use).toHaveBeenCalledOnceWith('en');
    expect(storageSpy.set).toHaveBeenCalledOnceWith('SELECTED_LANGUAGE', 'en');
    expect(apiProfilesServiceSpy.setLanguage).toHaveBeenCalledOnceWith('en');
  }));

  it('should default to device language (spanish) on setInitialAppLanguage when there is no selected language', fakeAsync(() => {
    storageSpy.get.and.returnValue(Promise.resolve(undefined));
    const deviceResponse = new FakeDevice(Promise.resolve({ value: 'es' }));
    deviceInjectableSpy.create.and.returnValue(deviceResponse);
    service.setInitialAppLanguage();
    tick();

    expect(translateServiceSpy.use).toHaveBeenCalledOnceWith('es');
    expect(storageSpy.set).toHaveBeenCalledOnceWith('SELECTED_LANGUAGE', 'es');
    expect(apiProfilesServiceSpy.setLanguage).toHaveBeenCalledOnceWith('es');
  }));

  it('should default to device language (english) on setInitialAppLanguage when there is no selected language', fakeAsync(() => {
    storageSpy.get.and.returnValue(Promise.resolve(undefined));
    service.setInitialAppLanguage();
    tick();

    expect(translateServiceSpy.use).toHaveBeenCalledOnceWith('en');
    expect(storageSpy.set).toHaveBeenCalledOnceWith('SELECTED_LANGUAGE', 'en');
    expect(apiProfilesServiceSpy.setLanguage).toHaveBeenCalledOnceWith('en');
  }));

  it('should default to device language (portuguese) on setInitialAppLanguage when there is no selected language', fakeAsync(() => {
    storageSpy.get.and.returnValue(Promise.resolve(undefined));
    const deviceResponse = new FakeDevice(Promise.resolve({ value: 'pt' }));
    deviceInjectableSpy.create.and.returnValue(deviceResponse);
    service.setInitialAppLanguage();
    tick();

    expect(translateServiceSpy.use).toHaveBeenCalledOnceWith('pt');
    expect(storageSpy.set).toHaveBeenCalledOnceWith('SELECTED_LANGUAGE', 'pt');
    expect(apiProfilesServiceSpy.setLanguage).toHaveBeenCalledOnceWith('pt');
  }));

  it('should get language from storage', () => {
    service.getSelectedLanguage();
    expect(storageSpy.get).toHaveBeenCalledTimes(1);
  });
});
