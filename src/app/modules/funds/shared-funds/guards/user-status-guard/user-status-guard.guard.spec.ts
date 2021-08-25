import { TestBed, async, inject } from '@angular/core/testing';

import { UserStatusGuard } from './user-status-guard.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';
import { navControllerMock } from '../../../../../../testing/spies/nav-controller-mock.spec';
import { ApiUsuariosService } from 'src/app/modules/usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';

function getObservable(obj: any): Observable<any> {
  if (obj instanceof Observable) {
    return obj;
  }
  return of(null);
}

describe('UserStatusGuard', () => {
  let userStatusGuard: UserStatusGuard;
  let apiUsuariosServiceSpy: any;
  let activatedRouteSnapshotMock: ActivatedRouteSnapshot;
  let navControllerSpy: any;

  beforeEach(() => {
    apiUsuariosServiceSpy = jasmine.createSpyObj('ApiUsuariosService', ['status']);
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    activatedRouteSnapshotMock = {
      paramMap: { get: (param) => 'test' },
    } as ActivatedRouteSnapshot;
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        UserStatusGuard,
        { provide: ApiUsuariosService, useValue: apiUsuariosServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    });
  });

  beforeEach(() => {
    userStatusGuard = TestBed.inject(UserStatusGuard);
  });

  it('should ...', () => {
    expect(userStatusGuard).toBeTruthy();
  });

  ['EXPLORER', 'COMPLETE'].forEach((status) => {
    it(`should be able to hit route when user status is ${status}`, () => {
      apiUsuariosServiceSpy.status.and.returnValue(of({ status_name: status }));
      const canActivateResult = getObservable(userStatusGuard.canActivate({} as ActivatedRouteSnapshot));
      canActivateResult.subscribe((res) => expect(res).toBe(true));
    });
  });

  ['BEGINNER', 'CREATOR'].forEach((status) => {
    it(`should not be able to hit route when user status is ${status}`, () => {
      apiUsuariosServiceSpy.status.and.returnValue(of({ status_name: status }));
      const canActivateResult = getObservable(userStatusGuard.canActivate({} as ActivatedRouteSnapshot));
      canActivateResult.subscribe((res) => expect(res).toBe(false));
    });
  });
});
