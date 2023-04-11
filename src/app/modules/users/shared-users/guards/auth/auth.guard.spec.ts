import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { AuthGuard } from './auth.guard';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeNavController } from '../../../../../../testing/fakes/nav-controller.fake.spec';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', { get: Promise.resolve(true) });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletFromStorage: Promise.resolve({ addresses: {} }),
    });
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AuthGuard,
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: StorageService, useValue: storageServiceSpy },
      ],
    });
  });

  beforeEach(() => {
    authGuard = TestBed.inject(AuthGuard);
  });

  it('should create', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should navigate to onboarding when user is not logged in', async () => {
    ionicStorageServiceSpy.get.and.resolveTo(false);
    expect(await authGuard.canActivate()).toBeFalse();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/users/on-boarding');
  });

  it('should navigate to onboarding when user is not logged in', async () => {
    storageServiceSpy.getWalletFromStorage.and.resolveTo(undefined);
    expect(await authGuard.canActivate()).toBeFalse();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/users/on-boarding');
  });

  it('should let continue navigation when user is logged in and has wallet ', async () => {
    expect(await authGuard.canActivate()).toBeTrue();
    expect(navControllerSpy.navigateForward).not.toHaveBeenCalled();
  });
});
