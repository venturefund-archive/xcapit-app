import { TestBed } from '@angular/core/testing';
import { UpdateNewsService } from './update-news.service';
import { ModalController } from '@ionic/angular';
import { FakeModalController } from '../../../../testing/fakes/modal-controller.fake.spec';
import { AppStorageService } from '../app-storage/app-storage.service';
import { AuthService } from '../../../modules/usuarios/shared-usuarios/services/auth/auth.service';
import { PlatformService } from '../platform/platform.service';

describe('UpdateNewsService', () => {
  let service: UpdateNewsService;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let appStorageServiceSpy: jasmine.SpyObj<AppStorageService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let platformServiceSpy: jasmine.SpyObj<PlatformService>;
  let appSpy: jasmine.SpyObj<any>;

  beforeEach(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    appStorageServiceSpy = jasmine.createSpyObj('AppStorageService', {
      get: Promise.resolve('2.0.0'),
      set: Promise.resolve(),
    });
    authServiceSpy = jasmine.createSpyObj('AuthService', { checkToken: Promise.resolve(true) });
    platformServiceSpy = jasmine.createSpyObj('PlatformService', { isNative: true });
    appSpy = jasmine.createSpyObj('App', { getInfo: Promise.resolve({ version: '2.0.0' }) });
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: AppStorageService, useValue: appStorageServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: PlatformService, useValue: platformServiceSpy },
      ],
    });
    service = TestBed.inject(UpdateNewsService);
    service.app = appSpy;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not show modal if web', async () => {
    platformServiceSpy.isNative.and.returnValue(false);
    await service.showModal();
    expect(modalControllerSpy.create).not.toHaveBeenCalled();
  });

  it('should show modal if native', async () => {
    appSpy.getInfo.and.returnValue(Promise.resolve({ version: '3.0.0' }));
    await service.showModal();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(appStorageServiceSpy.set).toHaveBeenCalledOnceWith('appVersion', '3.0.0');
  });

  it('should not show modal if native but not logged in', async () => {
    appSpy.getInfo.and.returnValue(Promise.resolve({ version: '3.0.0' }));
    authServiceSpy.checkToken.and.returnValue(Promise.resolve(false));
    await service.showModal();
    expect(modalControllerSpy.create).not.toHaveBeenCalled();
    expect(appStorageServiceSpy.set).not.toHaveBeenCalled();
  });

  it('should show modal if native and no storage version', async () => {
    appSpy.getInfo.and.returnValue(Promise.resolve({ version: '3.0.0' }));
    appStorageServiceSpy.get.and.returnValue(undefined);
    await service.showModal();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(appStorageServiceSpy.set).toHaveBeenCalledOnceWith('appVersion', '3.0.0');
  });
});
