import { TestBed } from '@angular/core/testing';

import { UserProfileDataGuard } from './user-profile-data.guard';
import { ProfilesHelperService } from '../../services/profiles-helper/profiles-helper.service';
import { of } from 'rxjs';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

describe('UserProfileDataGuard', () => {
  let userProfileDataGuard: UserProfileDataGuard;
  let profilesHelperSpy: any;
  beforeEach(() => {
    profilesHelperSpy = jasmine.createSpyObj('ProfilesHelperService', ['isProfileDataOk']);
    TestBed.configureTestingModule({
      providers: [UserProfileDataGuard, { provide: ProfilesHelperService, useValue: profilesHelperSpy }],
    });
  });

  beforeEach(() => {
    userProfileDataGuard = TestBed.inject(UserProfileDataGuard);
  });

  it('should ...', () => {
    expect(userProfileDataGuard).toBeTruthy();
  });

  it('should be able to hit route when isProfileDataOk is true', () => {
    profilesHelperSpy.isProfileDataOk.and.returnValue(of(true));
    userProfileDataGuard
      .canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
      .subscribe((result) => expect(result).toBe(true));
  });

  it('should not be able to hit route when isTaCAccepted is false', () => {
    profilesHelperSpy.isProfileDataOk.and.returnValue(of(false));
    userProfileDataGuard
      .canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
      .subscribe((result) => expect(result).toBe(false));
  });

  it('should call isProfileDataOk on profilesHelper when canActivate', () => {
    profilesHelperSpy.isProfileDataOk.and.returnValue(of(false));
    userProfileDataGuard
      .canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
      .subscribe((result) => expect(profilesHelperSpy.isProfileDataOk).toHaveBeenCalledTimes(1));
  });
});
