import { TestBed } from '@angular/core/testing';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { NavController } from '@ionic/angular';
import { HasWalletToBuyGuard } from './has-wallet-to-buy.guard';

describe('HasWalletToBuyGuard', () => {
  let hasWalletToBuyGuard: HasWalletToBuyGuard;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    fakeNavController = new FakeNavController({});
    navControllerSpy = fakeNavController.createSpy();
    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletFromStorage: Promise.resolve({ addresses: {} }),
    });
    TestBed.configureTestingModule({
      providers: [
        HasWalletToBuyGuard,
        { provide: NavController, useValue: navControllerSpy },
        { provide: StorageService, useValue: storageServiceSpy },
      ],
    });
  });

  beforeEach(() => {
    hasWalletToBuyGuard = TestBed.inject(HasWalletToBuyGuard);
  });

  it('should create', () => {
    expect(hasWalletToBuyGuard).toBeTruthy();
  });

  it('should hit route when wallet exists', async () => {
    const canActivateResult = await hasWalletToBuyGuard.canActivate();
    expect(storageServiceSpy.getWalletFromStorage).toHaveBeenCalledTimes(1);
    expect(canActivateResult).toBeTrue();
  });

  it('should navigate to no wallet to buy page when user doesnt have wallet', async () => {
    storageServiceSpy.getWalletFromStorage.and.resolveTo();
    await hasWalletToBuyGuard.canActivate();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/fiat-ramps/no-wallet-to-buy']);
  });
});
