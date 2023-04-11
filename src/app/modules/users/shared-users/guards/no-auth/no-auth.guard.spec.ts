import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { NoAuthGuard } from './no-auth.guard';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeNavController } from '../../../../../../testing/fakes/nav-controller.fake.spec';

describe('NoAuthGuard', () => {
  let noAuthGuard: NoAuthGuard;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;

  beforeEach(() => {
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', { get: Promise.resolve(true) });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        NoAuthGuard,
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    });
  });

  beforeEach(() => {
    noAuthGuard = TestBed.inject(NoAuthGuard);
  });

  it('should create', () => {
    expect(noAuthGuard).toBeTruthy();
  });

  it('should navigate to home wallet when the user is logged in', async () => {
    expect(await noAuthGuard.canActivate()).toBeFalse();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/tabs/wallets');
  });

  it('should not navigate to home wallet when the user is not logged in', async () => {
    ionicStorageServiceSpy.get.and.returnValue(Promise.resolve(false));

    expect(await noAuthGuard.canActivate()).toBeTrue();
    expect(navControllerSpy.navigateForward).not.toHaveBeenCalled();
  });
});
