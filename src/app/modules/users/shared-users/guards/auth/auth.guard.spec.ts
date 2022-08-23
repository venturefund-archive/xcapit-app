import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../../services/auth/auth.service';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authServiceMock: any;
  let authService: any;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;
  beforeEach(() => {
    authServiceMock = {
      checkToken: () => Promise.resolve(true),
      checkRefreshToken: () => Promise.resolve(true),
      sesionExpired: () => null,
    };

    remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', {
      getFeatureFlag: Promise.resolve(),
    });
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
      ],
    });
  });

  beforeEach(() => {
    authGuard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
  });

  it('should ...', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should be able to hit route when checkToken is true', async () => {
    const checkTokenSpy = spyOn(authService, 'checkToken');
    checkTokenSpy.and.returnValue(Promise.resolve(true));
    await expectAsync(authGuard.canActivate()).toBeResolvedTo(true);
  });

  it('should not be able to hit route when checkToken is false', async () => {
    const checkTokenSpy = spyOn(authService, 'checkToken');
    const checkRefreshTokenSpy = spyOn(authService, 'checkRefreshToken');
    checkTokenSpy.and.returnValue(Promise.resolve(false));
    checkRefreshTokenSpy.and.returnValue(Promise.resolve(false));
    await expectAsync(authGuard.canActivate()).toBeResolvedTo(false);
  });
  
  it('should call sesionExpired on authService when checkToken is false', async () => {
    const checkTokenSpy = spyOn(authService, 'checkToken');
    const checkRefreshTokenSpy = spyOn(authService, 'checkRefreshToken');
    const sesionExpiredSpy = spyOn(authService, 'sesionExpired');
    checkTokenSpy.and.returnValue(Promise.resolve(false));
    checkRefreshTokenSpy.and.returnValue(Promise.resolve(false));
    await authGuard.canActivate();
    expect(sesionExpiredSpy).toHaveBeenCalledTimes(1);
  });
  
  it('should skip token verification if feature flag is enabled', async() => {
    remoteConfigServiceSpy.getFeatureFlag.and.returnValue(true);
    await expectAsync(authGuard.canActivate()).toBeResolvedTo(true);
  });
});
