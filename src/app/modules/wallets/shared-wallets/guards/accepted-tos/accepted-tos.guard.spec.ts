import { TestBed } from '@angular/core/testing';
import { AcceptedToSGuard } from './accepted-tos.guard';
import { StorageWalletsService } from '../../services/storage-wallets/storage-wallets.service';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from '../../../../../../testing/dummy.component.spec';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { NavController } from '@ionic/angular';

describe('AcceptedToSGuard', () => {
  let guard: AcceptedToSGuard;
  let storageWalletsServiceSpy: any;
  let navControllerSpy: any;

  beforeEach(() => {
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    storageWalletsServiceSpy = jasmine.createSpyObj('StorageWalletsService', ['hasAcceptedToS']);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'wallets/create-first/disclaimer', component: DummyComponent }]),
      ],
      providers: [
        { provide: StorageWalletsService, useValue: storageWalletsServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    });
    guard = TestBed.inject(AcceptedToSGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect user to disclaimer page if ToS was not accepted', async () => {
    storageWalletsServiceSpy.hasAcceptedToS.and.returnValue(Promise.resolve(false));
    await guard.canActivate();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledTimes(1);
  });

  it('should not redirect user to disclaimer page if ToS was accepted', async () => {
    storageWalletsServiceSpy.hasAcceptedToS.and.returnValue(Promise.resolve(true));
    await guard.canActivate();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledTimes(0);
  });
});
