import { TestBed, waitForAsync } from '@angular/core/testing';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { LoginBiometricActivationModalService } from './login-biometric-activation-modal.service';

describe('LoginBiometricActivationModalService', () => {
  let service: LoginBiometricActivationModalService;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;

  beforeEach(waitForAsync(() => {
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(),
      set: Promise.resolve()
    })
    TestBed.configureTestingModule({
      providers: [
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
      ]
    });
    service = TestBed.inject(LoginBiometricActivationModalService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get notShowBiometricModal value on isShowModal ', async () => {
    ionicStorageServiceSpy.get.and.returnValue(Promise.resolve(true));
    await service.isShowModal();
    expect(ionicStorageServiceSpy.get).toHaveBeenCalledOnceWith('notShowBiometricModal')
  })

  it('should enable modal on enableModal', async () => {
    await service.enableModal();
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledWith('notShowBiometricModal', false)
  });

  it('should disable modal on disableModal', async () => {
    await service.disableModal();
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledWith('notShowBiometricModal', true)
  });
});
