import { TestBed } from '@angular/core/testing';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { NavController } from '@ionic/angular';
import { ActivatedRouteSnapshot } from '@angular/router';
import { NoWallet } from './no-wallet.service';
import { StorageWallet } from 'src/app/modules/wallets/shared-wallets/interfaces/storage-wallet.interface';

describe('NoWallet', () => {
  let noWallet: NoWallet;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let routeSpy: jasmine.SpyObj<ActivatedRouteSnapshot>;
  let routeSpyWithFallback: jasmine.SpyObj<ActivatedRouteSnapshot>;
  let storageWalletSpy: jasmine.SpyObj<StorageWallet>;
  const defaultFallbackUrl = '/users/login-new';
  const customFallbackUrl = '/test/custom-fallback/url';

  beforeEach(() => {
    storageWalletSpy = jasmine.createSpyObj('Wallet', {}, { addresses: {} });
    fakeNavController = new FakeNavController({});
    navControllerSpy = fakeNavController.createSpy();
    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletFromStorage: Promise.resolve(null),
    });
    routeSpy = jasmine.createSpyObj('ActivatedRouteSnapshot', {}, { data: {} });
    routeSpyWithFallback = jasmine.createSpyObj(
      'ActivatedRouteSnapshot',
      {},
      { data: { noWalletFallbackUrl: customFallbackUrl } }
    );
    TestBed.configureTestingModule({
      providers: [
        NoWallet,
        { provide: NavController, useValue: navControllerSpy },
        { provide: StorageService, useValue: storageServiceSpy },
      ],
    });
  });

  beforeEach(() => {
    noWallet = TestBed.inject(NoWallet);
  });

  it('should create', () => {
    noWallet = TestBed.inject(NoWallet);
    expect(noWallet).toBeTruthy();
  });

  it('should hit route when wallet not exist', async () => {
    const canActivateResult = await noWallet.canActivate(routeSpy);
    expect(storageServiceSpy.getWalletFromStorage).toHaveBeenCalledTimes(1);
    expect(canActivateResult).toBeTrue();
  });

  it('should navigate to default page when wallet exist', async () => {
    storageServiceSpy.getWalletFromStorage.and.resolveTo(storageWalletSpy);
    await noWallet.canActivate(routeSpy);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([defaultFallbackUrl]);
  });

  it('should navigate to fallback url when wallet exist', async () => {
    storageServiceSpy.getWalletFromStorage.and.resolveTo(storageWalletSpy);
    await noWallet.canActivate(routeSpyWithFallback);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([customFallbackUrl]);
  });
});
