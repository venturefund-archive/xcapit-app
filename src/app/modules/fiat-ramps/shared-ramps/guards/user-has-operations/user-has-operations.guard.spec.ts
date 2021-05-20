import { TestBed, async, inject } from '@angular/core/testing';

import { UserHasOperationsGuard } from './user-has-operations.guard';
import { FiatRampsService } from 'src/app/modules/fiat-ramps/shared-ramps/services/fiat-ramps.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Observable } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';
import { navControllerMock } from '../../../../../../testing/spies/nav-controller-mock.spec';

function getObservable(obj: any): Observable<any> {
  if (obj instanceof Observable) {
    return obj;
  }
  return of(null);
}

describe('UserHasOperationsGuard', () => {
  let userHasOperationsGuard: UserHasOperationsGuard;
  let fiatRampsServiceSpy: any;
  let activatedRouteSnapshotMock: ActivatedRouteSnapshot;
  let navControllerSpy: any;

  beforeEach(() => {
    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', [
      'userHasOperations'
    ]);
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    activatedRouteSnapshotMock = {} as ActivatedRouteSnapshot;
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        UserHasOperationsGuard,
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        { provide: NavController, useValue: navControllerSpy }
      ]
    });
  });

  beforeEach(() => {
    userHasOperationsGuard = TestBed.inject(UserHasOperationsGuard);
  });

  it('should ...', () => {
    expect(userHasOperationsGuard).toBeTruthy();
  });


  it('should call userHasOperations on fiatRampsService when canActivate', () => {
    fiatRampsServiceSpy.userHasOperations.and.returnValue(
      of({ user_has_operations: false })
    );
    const canActivateResult = getObservable(
        userHasOperationsGuard.canActivate(activatedRouteSnapshotMock)
    );
    canActivateResult.subscribe(res =>
      expect(fiatRampsServiceSpy.userHasOperations).toHaveBeenCalledTimes(1)
    );
  });

  it('should call navigateForward with ["/fiat-ramps/select-provider"], { replaceUrl: true } on navController when userHasOperations is false', () => {
    fiatRampsServiceSpy.userHasOperations.and.returnValue(
      of({ user_has_operations: false })
    );
    const canActivateResult = getObservable(
        userHasOperationsGuard.canActivate(activatedRouteSnapshotMock)
    );
    canActivateResult.subscribe(res => {
      expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
      expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(
        ['/fiat-ramps/select-provider'],
        { replaceUrl: true }
      );
    });
  });
});
