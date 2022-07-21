import { TestBed } from '@angular/core/testing';

import { ProfilesHelperService } from './profiles-helper.service';
import { of } from 'rxjs';
import { ApiProfilesService } from '../api-profiles/api-profiles.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { navControllerMock } from '../../../../../../testing/spies/nav-controller-mock.spec';

describe('ProfilesHelperService', () => {
  let profileHelperService: ProfilesHelperService;
  let apiProfilesServiceMock: any;
  let translateServiceSpy: any;
  let navControllerSpy: any;

  beforeEach(() => {
    apiProfilesServiceMock = {
      profileValid: jasmine.createSpy(),
      crud: jasmine.createSpyObj('CRUD', ['get']),
    };
    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    navControllerSpy.navigateForward.and.returnValue(of({}).toPromise());
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ApiProfilesService, useValue: apiProfilesServiceMock },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    });
  });

  beforeEach(() => {
    profileHelperService = TestBed.inject(ProfilesHelperService);
  });

  it('should be created', () => {
    expect(profileHelperService).toBeTruthy();
  });

  it('isFromGuard should return false when after call isFromGuardHasBeenCalled', () => {
    profileHelperService.isFromGuardHasBeenCalled();
    expect(profileHelperService.isFromGuard()).toBe(false);
  });

  it('shoud call get on apiProfilesService.profileValid when isProfileDataOk', async () => {
    apiProfilesServiceMock.profileValid.and.returnValue(of());
    await profileHelperService.isProfileDataOk('');
    expect(apiProfilesServiceMock.profileValid).toHaveBeenCalledTimes(1);
  });

  it('isProfileDataOk shoud return true when profileValid return { valid: true }', async () => {
    apiProfilesServiceMock.profileValid.and.returnValue(of({ valid: true }));
    await expectAsync(profileHelperService.isProfileDataOk('').toPromise()).toBeResolvedTo(true);
  });

  it('isProfileDataOk shoud return false when profileValid return { valid: false }', async () => {
    apiProfilesServiceMock.profileValid.and.returnValue(of({ valid: false }));
    await expectAsync(profileHelperService.isProfileDataOk('').toPromise()).toBeResolvedTo(false);
  });

  it('should call navigateForward with ["/profiles/user"], on navController when profileValid return { valid: false }', () => {
    apiProfilesServiceMock.profileValid.and.returnValue(of({ valid: false }));
    profileHelperService.isProfileDataOk('').subscribe((res) => {
      expect(profileHelperService.getUrlToAccess()).toEqual('');
      expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
      expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/profiles/user']);
    });
  });

  it('should getToastMessage return profiles.profile_helper.data_no_ok when urlToAccess is empty', () => {
    apiProfilesServiceMock.profileValid.and.returnValue(of({ valid: true }));
    profileHelperService
      .isProfileDataOk('')
      .subscribe((res) => expect(profileHelperService.getToastMessage()).toEqual('profiles.profile_helper.data_no_ok'));
  });

  it('should getToastMessage return profiles.profile_helper.from_new_referral_data_no_ok when urlToAccess is /referrals/new', () => {
    apiProfilesServiceMock.profileValid.and.returnValue(of({ valid: true }));
    profileHelperService
      .isProfileDataOk('/referrals/new')
      .subscribe((res) =>
        expect(profileHelperService.getToastMessage()).toEqual('profiles.profile_helper.from_new_referral_data_no_ok')
      );
  });

  it('should getToastMessage return profiles.profile_helper.from_new_fund_data_no_ok when urlToAccess is /funds/action/new', () => {
    apiProfilesServiceMock.profileValid.and.returnValue(of({ valid: true }));
    profileHelperService
      .isProfileDataOk('/funds/action/new')
      .subscribe((res) =>
        expect(profileHelperService.getToastMessage()).toEqual('profiles.profile_helper.from_new_fund_data_no_ok')
      );
  });
});