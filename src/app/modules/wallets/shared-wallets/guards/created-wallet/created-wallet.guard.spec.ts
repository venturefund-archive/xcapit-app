import { TestBed } from '@angular/core/testing';
import { CreatedWalletGuard } from './created-wallet.guard';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from '../../../../../../testing/dummy.component.spec';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { NavController } from '@ionic/angular';

describe('CreatedWalletGuard', () => {
  let guard: CreatedWalletGuard;
  let appStorageServiceSpy: any;
  let navControllerSpy: any;

  const wallet = {
    alias: '0x0000000000000000',
  };

  beforeEach(() => {
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    appStorageServiceSpy = jasmine.createSpyObj('AppStorageService', ['get']);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'wallets/create-first/disclaimer', component: DummyComponent }]),
      ],
      providers: [
        { provide: AppStorageService, useValue: appStorageServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    });
    guard = TestBed.inject(CreatedWalletGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect user to disclaimer page if wallet not exists', async () => {
    appStorageServiceSpy.get.and.returnValue(Promise.resolve(null));
    await guard.canActivate();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledTimes(0);
  });

  it('should not redirect user to disclaimer page if wallet exists', async () => {
    appStorageServiceSpy.get.and.returnValue(Promise.resolve(wallet));
    await guard.canActivate();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledTimes(1);
  });
});
