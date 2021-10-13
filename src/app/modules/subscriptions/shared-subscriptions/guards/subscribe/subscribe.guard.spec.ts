import { TestBed } from '@angular/core/testing';

import { SubscribeGuard } from './subscribe.guard';
import { AuthService } from 'src/app/modules/usuarios/shared-usuarios/services/auth/auth.service';
import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('SubscribeGuard', () => {
  let subscribeGuard: SubscribeGuard;
  let authServiceMock: any;
  let authService: any;
  let subscriptionsServiceSpy: any;
  let activatedRouteSnapshotMock: ActivatedRouteSnapshot;

  beforeEach(() => {
    authServiceMock = {
      checkToken: () => Promise.resolve(true),
      checkRefreshToken: () => Promise.resolve(true),
      sesionExpired: () => null,
    };
    subscriptionsServiceSpy = jasmine.createSpyObj('SubscriptionsService', ['saveLinkData']);
    activatedRouteSnapshotMock = {
      firstChild: { paramMap: { get: (param) => 'test' } },
    } as ActivatedRouteSnapshot;
    TestBed.configureTestingModule({
      providers: [
        SubscribeGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: SubscriptionsService, useValue: subscriptionsServiceSpy },
      ],
    });
  });

  beforeEach(() => {
    subscribeGuard = TestBed.inject(SubscribeGuard);
    authService = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(subscribeGuard).toBeTruthy();
  });

  it('should be able to hit route when checkToken is true', async () => {
    const checkTokenSpy = spyOn(authService, 'checkToken');
    checkTokenSpy.and.returnValue(Promise.resolve(true));
    await expectAsync(subscribeGuard.canActivate(activatedRouteSnapshotMock)).toBeResolvedTo(true);
  });

  it('should not be able to hit route when checkToken is false', async () => {
    const checkTokenSpy = spyOn(authService, 'checkToken');
    const checkRefreshTokenSpy = spyOn(authService, 'checkRefreshToken');
    checkTokenSpy.and.returnValue(Promise.resolve(false));
    checkRefreshTokenSpy.and.returnValue(Promise.resolve(false));
    await expectAsync(subscribeGuard.canActivate(activatedRouteSnapshotMock)).toBeResolvedTo(false);
  });

  it('should call sesionExpired on authService when checkToken is false', async () => {
    const checkTokenSpy = spyOn(authService, 'checkToken');
    const sesionExpiredSpy = spyOn(authService, 'sesionExpired');
    const checkRefreshTokenSpy = spyOn(authService, 'checkRefreshToken');
    checkTokenSpy.and.returnValue(Promise.resolve(false));
    checkRefreshTokenSpy.and.returnValue(Promise.resolve(false));
    await subscribeGuard.canActivate(activatedRouteSnapshotMock);
    expect(sesionExpiredSpy).toHaveBeenCalledTimes(1);
  });

  it('should call saveLinkData on subscriptionService when checkToken is false and checkRefreshToken is false', async () => {
    const checkTokenSpy = spyOn(authService, 'checkToken');
    const checkRefreshTokenSpy = spyOn(authService, 'checkRefreshToken');
    checkTokenSpy.and.returnValue(Promise.resolve(false));
    checkRefreshTokenSpy.and.returnValue(Promise.resolve(false));
    await subscribeGuard.canActivate(activatedRouteSnapshotMock);
    expect(subscriptionsServiceSpy.saveLinkData).toHaveBeenCalledTimes(1);
  });
});
