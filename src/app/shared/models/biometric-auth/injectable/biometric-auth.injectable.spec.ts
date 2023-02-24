import { TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { DefaultBiometricAuth } from '../default/default-biometric-auth';
import { BiometricAuthInjectable } from './biometric-auth.injectable';

describe('BiometricAuthInjectable', () => {
  let service: BiometricAuthInjectable;
  let storageSpy: jasmine.SpyObj<IonicStorageService>;
  beforeEach(waitForAsync(() => {
    storageSpy = jasmine.createSpyObj('IonicStorageService', {
        set: Promise.resolve(),
        get: Promise.resolve(true),
    });
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: IonicStorageService, useValue: storageSpy }],
    }).compileComponents();

    service = TestBed.inject(BiometricAuthInjectable);
  }));

  it('new', () => {
    expect(service).toBeTruthy();
  });

  it('create', () => {
    expect(service.create()).toBeInstanceOf(DefaultBiometricAuth);
  });
});
