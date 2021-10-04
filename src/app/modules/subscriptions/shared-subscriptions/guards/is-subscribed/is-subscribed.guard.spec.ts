import { TestBed } from '@angular/core/testing';

import { IsSubscribedGuard } from './is-subscribed.guard';
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

describe('IsSubscribedGuard', () => {
  let isSubscribedGuard: IsSubscribedGuard;
  let apiFundsServiceSpy: any;
  let activatedRouteSnapshotMock: ActivatedRouteSnapshot;
  let navControllerSpy: any;

  beforeEach(() => {
    apiFundsServiceSpy = jasmine.createSpyObj('ApiFundsService', ['isSubscribed']);
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    activatedRouteSnapshotMock = {
      paramMap: { get: (param) => 'test' },
    } as ActivatedRouteSnapshot;
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        IsSubscribedGuard,
        { provide: ApiFundsService, useValue: apiFundsServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    });
  });

  beforeEach(() => {
    isSubscribedGuard = TestBed.inject(IsSubscribedGuard);
  });

  it('should ...', () => {
    expect(isSubscribedGuard).toBeTruthy();
  });

  it('should be able to hit route when isSubscribed is true and fundName exist', () => {
    activatedRouteSnapshotMock.paramMap.get = (param) => 'test';
    apiFundsServiceSpy.isSubscribed.and.returnValue(of({ is_subscribed: true }));
    const canActivateResult = getObservable(isSubscribedGuard.canActivate(activatedRouteSnapshotMock));
    canActivateResult.subscribe((res) => expect(res).toBe(true));
  });

  it('should be able to hit route when fundName not exist', () => {
    activatedRouteSnapshotMock.paramMap.get = (param) => null;
    expect(isSubscribedGuard.canActivate(activatedRouteSnapshotMock)).toBe(true);
  });

  it('should not be able to hit route when isSubscribed is false and fundName exist', () => {
    activatedRouteSnapshotMock.paramMap.get = (param) => 'test';
    apiFundsServiceSpy.isSubscribed.and.returnValue(of({ is_subscribed: false }));
    const canActivateResult = getObservable(isSubscribedGuard.canActivate(activatedRouteSnapshotMock));
    canActivateResult.subscribe((res) => expect(res).toBe(false));
  });

  it('should call isSubscribed on apiFundsService when canActivate', () => {
    apiFundsServiceSpy.isSubscribed.and.returnValue(of({ is_subscribed: false }));
    const canActivateResult = getObservable(isSubscribedGuard.canActivate(activatedRouteSnapshotMock));
    canActivateResult.subscribe((res) => expect(apiFundsServiceSpy.isSubscribed).toHaveBeenCalledTimes(1));
  });

  it('should call navigateBack with ["/tabs/funds"], { replaceUrl: true } on navController when isSubscribed is false', () => {
    apiFundsServiceSpy.isSubscribed.and.returnValue(of({ is_subscribed: false }));
    const canActivateResult = getObservable(isSubscribedGuard.canActivate(activatedRouteSnapshotMock));
    canActivateResult.subscribe((res) => {
      expect(navControllerSpy.navigateBack).toHaveBeenCalledTimes(1);
      expect(navControllerSpy.navigateBack).toHaveBeenCalledWith(['/tabs/funds'], { replaceUrl: true });
    });
  });
});
