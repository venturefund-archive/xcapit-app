import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

import { NewLoginTickets } from './new-login-tickets.guard';

describe('NewLoginTickets', () => {
  let newLogin: NewLoginTickets;
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
      providers: [NewLoginTickets,
        { provide: NavController, useValue: navControllerSpy },
        { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
      ],
    });
  });

  beforeEach(() => {
    newLogin = TestBed.inject(NewLoginTickets);
  });

  it('should be created', () => {
    expect(newLogin).toBeTruthy();
  });

  it('should redirect to new create support ticket if feature flag is enabled', async () => {
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(true);
    await newLogin.canActivate();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith(['/tickets/new-create-support-ticket']);
  });

  it('should not redirect to new create support ticket if feature flag is disabled', async () => {
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(false);
    await newLogin.canActivate();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledTimes(0);
  });
});
