import { TestBed } from '@angular/core/testing';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { NavController } from '@ionic/angular';
import { HasWallet } from './has-wallet';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('HasWallet', () => {
  let hasWalletGuard: HasWallet;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let routeSpy: jasmine.SpyObj<ActivatedRouteSnapshot>;
  let routeSpyWithFallback: jasmine.SpyObj<ActivatedRouteSnapshot>;

  beforeEach(() => {
    fakeNavController = new FakeNavController({});
    navControllerSpy = fakeNavController.createSpy();
    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletFromStorage: Promise.resolve({ addresses: {} }),
    });
    routeSpy = jasmine.createSpyObj('ActivatedRouteSnapshot', {}, { data: {} });
    routeSpyWithFallback = jasmine.createSpyObj(
      'ActivatedRouteSnapshot',
      {},
      { data: { hasWalletFallbackUrl: '/test/custom-url' } }
    );
    TestBed.configureTestingModule({
      providers: [
        HasWallet,
        { provide: NavController, useValue: navControllerSpy },
        { provide: StorageService, useValue: storageServiceSpy },
      ],
    });
  });

  beforeEach(() => {
    hasWalletGuard = TestBed.inject(HasWallet);
  });

  it('should create', () => {
    hasWalletGuard = TestBed.inject(HasWallet);
    expect(hasWalletGuard).toBeTruthy();
  });

  it('should hit route when wallet exists', async () => {
    const canActivateResult = await hasWalletGuard.canActivate(routeSpy);
    expect(storageServiceSpy.getWalletFromStorage).toHaveBeenCalledTimes(1);
    expect(canActivateResult).toBeTrue();
  });

  it('should navigate to default page when user doesnt have wallet', async () => {
    storageServiceSpy.getWalletFromStorage.and.resolveTo();
    await hasWalletGuard.canActivate(routeSpy);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wallets/no-wallet']);
  });

  it('should navigate to fallback url when user doesnt have wallet', async () => {
    storageServiceSpy.getWalletFromStorage.and.resolveTo();
    await hasWalletGuard.canActivate(routeSpyWithFallback);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/test/custom-url']);
  });
});
