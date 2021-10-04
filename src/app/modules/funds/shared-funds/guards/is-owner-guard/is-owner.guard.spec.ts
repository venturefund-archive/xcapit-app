import { TestBed } from '@angular/core/testing';

import { IsOwnerGuard } from './is-owner.guard';
import { ApiFundsService } from 'src/app/modules/funds/shared-funds/services/api-funds/api-funds.service';
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

describe('IsOwnerGuard', () => {
  let isOwnerGuard: IsOwnerGuard;
  let apiFundsServiceSpy: any;
  let activatedRouteSnapshotMock: ActivatedRouteSnapshot;
  let navControllerSpy: any;

  beforeEach(() => {
    apiFundsServiceSpy = jasmine.createSpyObj('ApiFundsService', ['isOwner']);
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    activatedRouteSnapshotMock = {
      paramMap: { get: (param) => 'test' },
    } as ActivatedRouteSnapshot;
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        IsOwnerGuard,
        { provide: ApiFundsService, useValue: apiFundsServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    });
  });

  beforeEach(() => {
    isOwnerGuard = TestBed.inject(IsOwnerGuard);
  });

  it('should ...', () => {
    expect(isOwnerGuard).toBeTruthy();
  });

  it('should be able to hit route when isOwner is true and fundName exist', () => {
    activatedRouteSnapshotMock.paramMap.get = (param) => 'test';
    apiFundsServiceSpy.isOwner.and.returnValue(of({ is_owner: true }));
    const canActivateResult = getObservable(isOwnerGuard.canActivate(activatedRouteSnapshotMock));
    canActivateResult.subscribe((res) => expect(res).toBe(true));
  });

  it('should be able to hit route when fundName not exist', () => {
    activatedRouteSnapshotMock.paramMap.get = (param) => null;
    expect(isOwnerGuard.canActivate(activatedRouteSnapshotMock)).toBe(true);
  });

  it('should not be able to hit route when isOwner is false and fundName exist', () => {
    activatedRouteSnapshotMock.paramMap.get = (param) => 'test';
    apiFundsServiceSpy.isOwner.and.returnValue(of({ is_owner: false }));
    const canActivateResult = getObservable(isOwnerGuard.canActivate(activatedRouteSnapshotMock));
    canActivateResult.subscribe((res) => expect(res).toBe(false));
  });

  it('should call isOwner on apiFundsService when canActivate', () => {
    apiFundsServiceSpy.isOwner.and.returnValue(of({ is_owner: false }));
    const canActivateResult = getObservable(isOwnerGuard.canActivate(activatedRouteSnapshotMock));
    canActivateResult.subscribe((res) => expect(apiFundsServiceSpy.isOwner).toHaveBeenCalledTimes(1));
  });

  it('should call navigateBack with ["/tabs/funds"], { replaceUrl: true } on navController when isOwner is false', () => {
    apiFundsServiceSpy.isOwner.and.returnValue(of({ is_owner: false }));
    const canActivateResult = getObservable(isOwnerGuard.canActivate(activatedRouteSnapshotMock));
    canActivateResult.subscribe((res) => {
      expect(navControllerSpy.navigateBack).toHaveBeenCalledTimes(1);
      expect(navControllerSpy.navigateBack).toHaveBeenCalledWith(['/tabs/funds'], { replaceUrl: true });
    });
  });
});
