import { TestBed, async, inject } from '@angular/core/testing';

import { TacAcceptedGuard } from './tac-accepted.guard';
import { TacHelperService } from '../../services/tac-helper/tac-helper.service';
import { of } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('TacAcceptedGuard', () => {
  let tacAcceptedGuard: TacAcceptedGuard;
  let tacHelperServiceSpy: any;

  beforeEach(() => {
    tacHelperServiceSpy = jasmine.createSpyObj('TacHelperService', [
      'isTaCAccepted'
    ]);
    TestBed.configureTestingModule({
      providers: [
        TacAcceptedGuard,
        { provide: TacHelperService, useValue: tacHelperServiceSpy }
      ]
    });
  });

  beforeEach(() => {
    tacAcceptedGuard = TestBed.inject(TacAcceptedGuard);
  });

  it('should ...', () => {
    expect(tacAcceptedGuard).toBeTruthy();
  });

  it('should be able to hit route when isTaCAccepted is true', () => {
    tacHelperServiceSpy.isTaCAccepted.and.returnValue(of(true));
    tacAcceptedGuard
      .canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
      .subscribe(result => expect(result).toBe(true));
  });

  it('should not be able to hit route when isTaCAccepted is false', () => {
    tacHelperServiceSpy.isTaCAccepted.and.returnValue(of(false));
    tacAcceptedGuard
      .canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
      .subscribe(result => expect(result).toBe(false));
  });

  it('should call isTaCAccepted on tacHelperService when canActivate', () => {
    tacHelperServiceSpy.isTaCAccepted.and.returnValue(of(true));
    tacAcceptedGuard
      .canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
      .subscribe(result => expect(tacHelperServiceSpy.isTaCAccepted).toHaveBeenCalledTimes(1));
  });
});
