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
    ionicStorageServiceSpy.get.withArgs('conditionsPurchasesAccepted').and.resolveTo(true);
    ionicStorageServiceSpy.get.withArgs('warranty_wallet').and.resolveTo(false);
    TestBed.configureTestingModule({
      providers: [
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    });
    guard = TestBed.inject(HasAcceptedBuyConditionsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect to home of purchases if user has a simplified wallet', async () => {
    ionicStorageServiceSpy.get.withArgs('warranty_wallet').and.resolveTo(true);
    await guard.canActivate();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/fiat-ramps/purchases']);
  });

  it('should redirect to terms and conditions if user has a web3 wallet and has not accepted buy conditions', async () => {
    ionicStorageServiceSpy.get.withArgs('conditionsPurchasesAccepted').and.resolveTo(false);
    await guard.canActivate();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/fiat-ramps/buy-conditions']);
  });

  it('should allow access if user has a web3 wallet and accepted buy conditions', async () => {
    const result = await guard.canActivate();
    expect(result).toBeTrue();
  });
});
