import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LanguageService } from './language.service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { DeviceInjectable } from '../../models/device/injectable/device.injectable';
import { FakeDevice } from '../../models/device/fake/fake-device';
import { ActiveLenderInjectable } from '../../models/active-lender/injectable/active-lender.injectable';
import { FakeLender } from '../../models/lender/fake/fake-lender';
import { ActiveLender } from '../../models/active-lender/active-lender';

describe('LanguageService', () => {
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  let storageSpy: jasmine.SpyObj<Storage>;
  let service: LanguageService;
  let deviceInjectableSpy: jasmine.SpyObj<DeviceInjectable>;
  let fakeDevice: FakeDevice;
  let activeLenderInjectableSpy: jasmine.SpyObj<ActiveLenderInjectable>;
  let activeLenderSpy: jasmine.SpyObj<ActiveLender>;

  beforeEach(() => {
    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use']);
    storageSpy = jasmine.createSpyObj('Storage', {
      get: Promise.resolve('en'),
      set: Promise.resolve(),
    });
    fakeDevice = new FakeDevice(Promise.resolve({ value: 'en' }));
    deviceInjectableSpy = jasmine.createSpyObj('fakeDevice', {
      create: fakeDevice,
    });
    activeLenderSpy = jasmine.createSpyObj('ActiveLender', {
      value: Promise.resolve(new FakeLender()),
      name: Promise.resolve('aLenderName'),
      save: Promise.resolve(),
      fromDynamicLink: Promise.resolve(false),
    });
    activeLenderInjectableSpy = jasmine.createSpyObj('ActiveLenderInjectable', {
      create: activeLenderSpy,
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: Storage, useValue: storageSpy },
        { provide: DeviceInjectable, useValue: deviceInjectableSpy },
        { provide: ActiveLenderInjectable, useValue: activeLenderInjectableSpy },
      ],
    });
    service = TestBed.inject(LanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an array of languages', () => {
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
  }));

  it('should default to english when device language is not a valid language and language is not coming from lender', fakeAsync(() => {
    storageSpy.get.and.returnValue(Promise.resolve(undefined));
    const deviceResponse = new FakeDevice(Promise.resolve({ value: 'xx' }));
    deviceInjectableSpy.create.and.returnValue(deviceResponse);
    service.setInitialAppLanguage();
    tick();

    expect(translateServiceSpy.use).toHaveBeenCalledOnceWith('en');
    expect(storageSpy.set).toHaveBeenCalledOnceWith('SELECTED_LANGUAGE', 'en');
  }));

  it('should default to device language (spanish) on setInitialAppLanguage when there is no selected language', fakeAsync(() => {
    storageSpy.get.and.returnValue(Promise.resolve(undefined));
    const deviceResponse = new FakeDevice(Promise.resolve({ value: 'es' }));
    deviceInjectableSpy.create.and.returnValue(deviceResponse);
    service.setInitialAppLanguage();
    tick();

    expect(translateServiceSpy.use).toHaveBeenCalledOnceWith('es');
    expect(storageSpy.set).toHaveBeenCalledOnceWith('SELECTED_LANGUAGE', 'es');
  }));

  it('should get language from storage', () => {
    service.getSelectedLanguage();
    expect(storageSpy.get).toHaveBeenCalledTimes(1);
  });
});
