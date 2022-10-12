import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { NewLoginRedirectGuard } from './new-login-redirect-guard';

describe('NewLoginRedirectGuard', () => {
  let newLoginRedirectGuard: NewLoginRedirectGuard;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;

  beforeEach(() => {
    remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', { getFeatureFlag: true });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        NewLoginRedirectGuard,
        { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    })
    newLoginRedirectGuard = TestBed.inject(NewLoginRedirectGuard);
  });

  it('should create', () => {
    expect(newLoginRedirectGuard).toBeTruthy();
  });

  it('should navigate to Wallet tab if feature flag is enabled.', async () => {
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(true);
    await newLoginRedirectGuard.canActivate();

    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['tabs/wallets']);
  });

  it('should not navigate to Wallet tab if feature flag is enabled', async () => {
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(false);
    await newLoginRedirectGuard.canActivate();

    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
  });
});
