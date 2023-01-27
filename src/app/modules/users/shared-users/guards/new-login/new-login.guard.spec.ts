import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { NewLogin } from './new-login.guard';

describe('NewLogin', () => {
  let newLogin: NewLogin;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;
  let routeSnapshotSpy: jasmine.SpyObj<ActivatedRouteSnapshot>;
  const data = {
    redirectUrl: 'test'
  };

  beforeEach(() => {
    routeSnapshotSpy = jasmine.createSpyObj('ActivatedRouteSnapshot', {}, {
      data: {}
    });
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

  it('should navigate to new login if feature flag is enabled', async () => {
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(true);
    await newLogin.canActivate(routeSnapshotSpy);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/users/login-new']);
  });

  it('should not navigate to new login if feature flag is enabled', async () => {
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(false);
    await newLogin.canActivate(routeSnapshotSpy);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledTimes(0);
  });

  it('should navigate to custom route if feature flag is enabled', async () => {
    (Object.getOwnPropertyDescriptor(routeSnapshotSpy, "data").get as jasmine.Spy).and.returnValue(data);
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(true);
    await newLogin.canActivate(routeSnapshotSpy);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['test']);
  });

  it('should not navigate to custom route if feature flag is enabled', async () => {
    (Object.getOwnPropertyDescriptor(routeSnapshotSpy, "data").get as jasmine.Spy).and.returnValue(data);
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(false);
    await newLogin.canActivate(routeSnapshotSpy);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledTimes(0);
  });
});
