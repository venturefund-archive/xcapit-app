import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { SwapTYCAccepted } from './swap-tyc-accepted';

describe('SwapTYCAccepted', () => {
  let swapTYCAccepted: SwapTYCAccepted;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;

  beforeEach(() => {
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', { get: Promise.resolve() });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        SwapTYCAccepted,
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    });
  });

  beforeEach(() => {
    swapTYCAccepted = TestBed.inject(SwapTYCAccepted);
  });

  it('should create', () => {
    expect(swapTYCAccepted).toBeTruthy();
  });

  it('should navigate to terms and conditions when the user has not previously accepted them', async () => {
    expect(await swapTYCAccepted.canActivate()).toBeFalse();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['swaps/swap-terms-and-conditions']);
  });

  it('should let it continue to financial education', async () => {
    ionicStorageServiceSpy.get.and.returnValue(Promise.resolve(true));

    expect(await swapTYCAccepted.canActivate()).toBeTrue();
    expect(navControllerSpy.navigateForward).not.toHaveBeenCalled();
  });
});
