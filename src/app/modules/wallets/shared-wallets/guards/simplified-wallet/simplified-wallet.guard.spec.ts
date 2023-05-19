import { SimplifiedWalletGuard } from './simplified-wallet.guard';
import { NavController } from '@ionic/angular';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { TestBed } from '@angular/core/testing';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

describe('SimplifiedWalletGuard', () => {
  let simplifiedWalletGuard: SimplifiedWalletGuard;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(),
      get: Promise.resolve(false),
    });

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        SimplifiedWalletGuard,
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    });
    simplifiedWalletGuard = TestBed.inject(SimplifiedWalletGuard);
  });

  it('should create', () => {
    expect(simplifiedWalletGuard).toBeTruthy();
  });

  it('should navigate to home wallet when the user is not simplified Wallet', async () => {
    expect(await simplifiedWalletGuard.canActivate()).toBeFalse();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/tabs/wallets']);
  });

  it('should not navigate to home wallet when the user is simplified wallet', async () => {
    ionicStorageServiceSpy.get.and.returnValue(Promise.resolve(true));

    expect(await simplifiedWalletGuard.canActivate()).toBeTrue();
    expect(navControllerSpy.navigateRoot).not.toHaveBeenCalled();
  });
});
