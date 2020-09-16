import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';

import { SubscribeGuard } from './subscribe.guard';
import { AuthService } from 'src/app/modules/usuarios/shared-usuarios/services/auth/auth.service';
import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';
import { of } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('SubscribeGuard', () => {
  let subscribeGuard: SubscribeGuard;
  let authServiceSpy: any;
  let subscriptionsServiceSpy: any;
  let activatedRouteSnapshotMock: ActivatedRouteSnapshot;

  beforeEach(() => {
    authServiceSpy = {
      checkToken: () => Promise.resolve(true),
      sesionExpired: () => null
    };
    subscriptionsServiceSpy = jasmine.createSpyObj('SubscriptionsService', [
      'saveLinkData'
    ]);
    activatedRouteSnapshotMock = {
      firstChild: { paramMap: { get: param => 'test' } }
    } as ActivatedRouteSnapshot;
    TestBed.configureTestingModule({
      providers: [
        SubscribeGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: SubscriptionsService, useValue: subscriptionsServiceSpy }
      ]
    });
  });

  beforeEach(() => {

    subscribeGuard = TestBed.inject(SubscribeGuard);
    authServiceSpy = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(subscribeGuard).toBeTruthy();
  });

  it('should be able to hit route when checkToken is true', async (done) => {
    const checkTokenSpy = spyOn(authServiceSpy, 'checkToken');
    checkTokenSpy.and.returnValue(Promise.resolve(true));
    subscribeGuard
      .canActivate(activatedRouteSnapshotMock)
      .then(res => expect(res).toBe(true));
    done();
  });

  it('should not be able to hit route when checkToken is false', async (done) => {
    const checkTokenSpy = spyOn(authServiceSpy, 'checkToken');
    checkTokenSpy.and.returnValue(Promise.resolve(false));
    subscribeGuard
      .canActivate(activatedRouteSnapshotMock)
      .then(res => expect(res).toBe(false));
    done();
  });

  it('should call sesionExpired on authService when checkToken is false', async (done) => {
    const checkTokenSpy = spyOn(authServiceSpy, 'checkToken');
    const sesionExpiredSpy = spyOn(authServiceSpy, 'sesionExpired');
    checkTokenSpy.and.returnValue(Promise.resolve(false));
    subscribeGuard
      .canActivate(activatedRouteSnapshotMock)
      .then(res =>
        expect(sesionExpiredSpy).toHaveBeenCalledTimes(1)
      );
    done();
  });

  it('should call saveLinkData on subscriptionService when checkToken is false', async (done) => {
    const checkTokenSpy = spyOn(authServiceSpy, 'checkToken');
    checkTokenSpy.and.returnValue(Promise.resolve(false));
    subscribeGuard
      .canActivate(activatedRouteSnapshotMock)
      .then(res =>
        expect(subscriptionsServiceSpy.saveLinkData).toHaveBeenCalledTimes(1)
      );
    done();
  });
});
