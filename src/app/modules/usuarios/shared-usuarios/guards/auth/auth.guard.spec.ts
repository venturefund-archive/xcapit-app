import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../../services/auth/auth.service';
import { of } from 'rxjs';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authServiceSpy: any;
  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'checkToken',
      'sesionExpired'
    ]);
    TestBed.configureTestingModule({
      providers: [AuthGuard, { provide: AuthService, useValue: authServiceSpy }]
    });
  });

  beforeEach(() => {
    authGuard = TestBed.get(AuthGuard);
  });

  it('should ...', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should be able to hit route when checkToken is true', () => {
    authServiceSpy.checkToken.and.returnValue(of(true).toPromise());
    authGuard.canActivate().then(res => expect(res).toBe(true));
  });

  it('should not be able to hit route when checkToken is false', () => {
    authServiceSpy.checkToken.and.returnValue(of(false).toPromise());
    authGuard.canActivate().then(res => expect(res).toBe(false));
  });

  it('should call sesionExpired on authService when checkToken is false', () => {
    authServiceSpy.checkToken.and.returnValue(of(false).toPromise());
    authGuard
      .canActivate()
      .then(res =>
        expect(authServiceSpy.sesionExpired).toHaveBeenCalledTimes(1)
      );
  });
});
