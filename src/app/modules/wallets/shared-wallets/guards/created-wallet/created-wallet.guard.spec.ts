import { TestBed } from '@angular/core/testing';
import { CreatedWalletGuard } from './created-wallet.guard';
import { StorageService } from 'src/app/modules/wallets/shared-wallets/services/storage-wallets/storage-wallets.service';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from '../../../../../../testing/dummy.component.spec';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { NavController } from '@ionic/angular';

describe('CreatedWalletGuard', () => {
  let guard: CreatedWalletGuard;
  let storageServiceSpy: any;
  let navControllerSpy: any;

  const wallet = {
    alias: '0x0000000000000000',
  };

  beforeEach(() => {
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    storageServiceSpy = jasmine.createSpyObj('storageService', ['getWalletFromStorage']);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'wallets/create-first/disclaimer', component: DummyComponent }]),
      ],
      providers: [
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    });
    guard = TestBed.inject(CreatedWalletGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect user to disclaimer page if wallet not exists', async () => {
    storageServiceSpy.getWalletFromStorage.and.returnValue(Promise.resolve(null));
    await guard.canActivate();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledTimes(0);
  });

  it('should not redirect user to disclaimer page if wallet exists', async () => {
    storageServiceSpy.getWalletFromStorage.and.returnValue(Promise.resolve(wallet));
    await guard.canActivate();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledTimes(1);
  });
});
