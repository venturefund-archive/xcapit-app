import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { HasAcceptedBuyConditionsGuard } from './has-accepted-buy-conditions.guard';

describe('HasAcceptedBuyConditionsGuard', () => {
  let guard: HasAcceptedBuyConditionsGuard;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>; 
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(true),
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ]
    });
    guard = TestBed.inject(HasAcceptedBuyConditionsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if user accepted buy conditions', async () => {
    const result = await guard.canActivate();
    expect(result).toBeTrue();
  });

  it('should deny access and redirect to conditions if user has not accepted buy conditions', async () => {
    ionicStorageServiceSpy.get.and.resolveTo(false);
    const result = await guard.canActivate();
    expect(result).toBeFalse();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/fiat-ramps/buy-conditions']);
  });
});
