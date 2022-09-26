import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { PlannerIntroductionCompletedGuard } from './planner-introduction-completed';

describe('PlannerIntroductionCompletedGuard', () => {
  let introductionCompletedGuard: PlannerIntroductionCompletedGuard;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let appStorageServiceSpy: jasmine.SpyObj<AppStorageService>;

  beforeEach(() => {
    appStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', { get: Promise.resolve(undefined) });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        PlannerIntroductionCompletedGuard,
        { provide: AppStorageService, useValue: appStorageServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    });
  });

  beforeEach(() => {
    introductionCompletedGuard = TestBed.inject(PlannerIntroductionCompletedGuard);
  });

  it('should create', () => {
    expect(introductionCompletedGuard).toBeTruthy();
  });

  it('should navigate to the introduction if the user does not have planner objective.', async () => {
    expect(await introductionCompletedGuard.canActivate()).toBeFalse();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('financial-planner/information');
  });

  it('should let it continue to financial planner', async () => {
    appStorageServiceSpy.get.and.resolveTo({});

    expect(await introductionCompletedGuard.canActivate()).toBeTrue();
    expect(navControllerSpy.navigateForward).not.toHaveBeenCalled();
  });
});
