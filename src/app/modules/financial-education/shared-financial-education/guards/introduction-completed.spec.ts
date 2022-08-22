import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { IntroductionCompletedGuard } from './introduction-completed';

describe('NoAuthNewGuard', () => {
  let introductionCompletedGuard: IntroductionCompletedGuard;
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
        IntroductionCompletedGuard,
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    });
  });

  beforeEach(() => {
    introductionCompletedGuard = TestBed.inject(IntroductionCompletedGuard);
  });

  it('should create', () => {
    expect(introductionCompletedGuard).toBeTruthy();
  });

  it('should navigate to the introduction if the user does not have it complete.', async () => {
    expect(await introductionCompletedGuard.canActivate()).toBeFalse();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/financial-education/introduction/financial-freedom');
  });

  it('should let it continue to financial education', async () => {
    ionicStorageServiceSpy.get.and.returnValue(Promise.resolve(true));

    expect(await introductionCompletedGuard.canActivate()).toBeTrue();
    expect(navControllerSpy.navigateForward).not.toHaveBeenCalled();
  });
});
