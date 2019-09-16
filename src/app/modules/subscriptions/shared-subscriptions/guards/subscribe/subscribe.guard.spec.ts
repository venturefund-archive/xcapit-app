import { TestBed, async, inject } from '@angular/core/testing';

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
    authServiceSpy = jasmine.createSpyObj('AuthService', ['checkToken']);
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
    subscribeGuard = TestBed.get(SubscribeGuard);
  });

  it('should ...', () => {
    expect(subscribeGuard).toBeTruthy();
  });

  it('should be able to hit route when checkToken is true', () => {
    authServiceSpy.checkToken.and.returnValue(of(true).toPromise());
    subscribeGuard
      .canActivate(activatedRouteSnapshotMock)
      .then(res => expect(res).toBe(true));
  });

  it('should not be able to hit route when checkToken is false', () => {
    authServiceSpy.checkToken.and.returnValue(of(false).toPromise());
    subscribeGuard
      .canActivate(activatedRouteSnapshotMock)
      .then(res => expect(res).toBe(false));
  });

  it('should call sesionExpired on authService when checkToken is false', () => {
    authServiceSpy.checkToken.and.returnValue(of(false).toPromise());
    subscribeGuard
      .canActivate(activatedRouteSnapshotMock)
      .then(res =>
        expect(authServiceSpy.sesionExpired).toHaveBeenCalledTimes(1)
      );
  });

  it('should call saveLinkData on subscriptionService when checkToken is false', () => {
    authServiceSpy.checkToken.and.returnValue(of(false).toPromise());
    subscribeGuard
      .canActivate(activatedRouteSnapshotMock)
      .then(res =>
        expect(subscriptionsServiceSpy.saveLinkData).toHaveBeenCalledTimes(1)
      );
  });
});
