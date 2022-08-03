import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { NewLogin } from './new-login.guard';

describe('NewLogin', () => {
  let newLogin: NewLogin;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;
  beforeEach(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', {
      getFeatureFlag: Promise.resolve(),
    });
    TestBed.configureTestingModule({
      providers: [NewLogin,
        { provide: NavController, useValue: navControllerSpy },
        { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
      ],
    });
  });

  beforeEach(() => {
    newLogin = TestBed.inject(NewLogin);
  });

  it('should be created', () => {
    expect(newLogin).toBeTruthy();
  });

  it('should navigate to on boarding if feature flag is enabled', async () => {
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(true);
    await newLogin.canActivate();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledTimes(1);
  });

  it('should not navigate to on boarding if feature flag is enabled', async () => {
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(false);
    await newLogin.canActivate();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledTimes(0);
  });
});
