import { TestBed, inject } from '@angular/core/testing';

import { BeforeStepDataGuard } from './before-step-data.guard';
import { ProfilesHelperService } from '../../services/profiles-helper/profiles-helper.service';
import { of } from 'rxjs';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

describe('BeforeStepDataGuard', () => {
  let BeforeStepDataGuard: BeforeStepDataGuard;
  let profilesHelperSpy: any;
  beforeEach(() => {
    profilesHelperSpy = jasmine.createSpyObj('ProfilesHelperService', [
      'isProfileDataOk'
    ]);
    TestBed.configureTestingModule({
      providers: [
        BeforeStepDataGuard,
        { provide: ProfilesHelperService, useValue: profilesHelperSpy }
      ]
    });
  });

  beforeEach(() => {
    BeforeStepDataGuard = TestBed.get(BeforeStepDataGuard);
  });

  it('should ...', () => {
    expect(BeforeStepDataGuard).toBeTruthy();
  });

  it('should be able to hit route when isProfileDataOk is true', () => {
    profilesHelperSpy.isProfileDataOk.and.returnValue(of(true));
    BeforeStepDataGuard
      .canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
      .subscribe(result => expect(result).toBe(true));
  });

  it('should not be able to hit route when isTaCAccepted is false', () => {
    profilesHelperSpy.isProfileDataOk.and.returnValue(of(false));
    BeforeStepDataGuard
      .canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
      .subscribe(result => expect(result).toBe(false));
  });

  it('should call isProfileDataOk on profilesHelper when canActivate', () => {
    profilesHelperSpy.isProfileDataOk.and.returnValue(of(false));
    BeforeStepDataGuard
      .canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
      .subscribe(result =>
        expect(profilesHelperSpy.isProfileDataOk).toHaveBeenCalledTimes(1)
      );
  });
});
