import { TestBed, async, inject } from '@angular/core/testing';

import { NoAuthGuard } from './no-auth.guard';
import { AuthService } from '../../services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { NavController } from '@ionic/angular';
import { navControllerMock } from '../../../../../../testing/spies/nav-controller-mock.spec';

describe('NoAuthGuard', () => {
  let noAuthGuard: NoAuthGuard;
  let authServiceSpy: any;
  let navControllerSpy: any;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['checkToken', 'checkRefreshToken']);
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        NoAuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    });
  });

  beforeEach(() => {
    noAuthGuard = TestBed.inject(NoAuthGuard);
  });

  it('should ...', () => {
    expect(noAuthGuard).toBeTruthy();
  });

  it('should be able to hit route when checkToken is false and checkRefreshToken is false ', async (done) => {
    authServiceSpy.checkToken.and.returnValue(of(false).toPromise());
    authServiceSpy.checkRefreshToken.and.returnValue(of(false).toPromise());
    noAuthGuard.canActivate().then((res) => expect(res).toBe(true));
    done();
  });

  it('should not be able to hit route when checkToken is true', async (done) => {
    authServiceSpy.checkToken.and.returnValue(of(true).toPromise());
    noAuthGuard.canActivate().then((res) => expect(res).toBe(false));
    done();
  });

  it('should call navigateRoot with ["/tabs/funds"] on navController when checkToken is true', async (done) => {
    authServiceSpy.checkToken.and.returnValue(of(true).toPromise());
    noAuthGuard.canActivate().then((res) => {
      expect(navControllerSpy.navigateRoot).toHaveBeenCalledTimes(1);
      expect(navControllerSpy.navigateRoot).toHaveBeenCalledWith(['/tabs/funds']);
    });
    done();
  });

  it('should call navigateRoot with ["/tabs/funds"] on navController when checkToken is false and checkRefreshToken is true', async (done) => {
    authServiceSpy.checkToken.and.returnValue(of(false).toPromise());
    authServiceSpy.checkRefreshToken.and.returnValue(of(true).toPromise());
    noAuthGuard.canActivate().then((res) => {
      expect(navControllerSpy.navigateRoot).toHaveBeenCalledTimes(1);
      expect(navControllerSpy.navigateRoot).toHaveBeenCalledWith(['/tabs/funds']);
    });
    done();
  });
});
