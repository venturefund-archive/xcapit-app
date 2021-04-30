import { TestBed, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../../services/auth/auth.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authServiceMock: any;
  let authService: any;
  beforeEach(() => {
    authServiceMock = {
      checkToken: () => Promise.resolve(true),
      checkRefreshToken: () => Promise.resolve(true),
      sesionExpired: () => null,
    };
    TestBed.configureTestingModule({
      providers: [AuthGuard, { provide: AuthService, useValue: authServiceMock }],
    });
  });

  beforeEach(() => {
    authGuard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
  });

  it('should ...', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should be able to hit route when checkToken is true', async (done) => {
    const checkTokenSpy = spyOn(authService, 'checkToken');
    checkTokenSpy.and.returnValue(Promise.resolve(true));
    authGuard.canActivate().then((res) => expect(res).toBe(true));
    done();
  });

  it('should not be able to hit route when checkToken is false', async (done) => {
    const checkTokenSpy = spyOn(authService, 'checkToken');
    const checkRefreshTokenSpy = spyOn(authService, 'checkRefreshToken');
    checkTokenSpy.and.returnValue(Promise.resolve(false));
    checkRefreshTokenSpy.and.returnValue(Promise.resolve(false));
    authGuard.canActivate().then((res) => expect(res).toBe(false));
    done();
  });

  it('should call sesionExpired on authService when checkToken is false', async (done) => {
    const checkTokenSpy = spyOn(authService, 'checkToken');
    const checkRefreshTokenSpy = spyOn(authService, 'checkRefreshToken');
    const sesionExpiredSpy = spyOn(authService, 'sesionExpired');
    checkTokenSpy.and.returnValue(Promise.resolve(false));
    checkRefreshTokenSpy.and.returnValue(Promise.resolve(false));
    authGuard.canActivate().then((res) => expect(sesionExpiredSpy).toHaveBeenCalledTimes(1));
    done();
  });
});
