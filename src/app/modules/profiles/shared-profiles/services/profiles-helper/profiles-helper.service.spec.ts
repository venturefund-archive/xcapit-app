import { TestBed } from '@angular/core/testing';

import { ProfilesHelperService } from './profiles-helper.service';
import { of } from 'rxjs';
import { ApiProfilesService } from '../api-profiles/api-profiles.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';

describe('ProfilesHelperService', () => {
  let profileHelperService: ProfilesHelperService;
  let apiProfilesServiceMock: any;
  let translateServiceSpy: any;
  let navControllerSpy: any;

  beforeEach(() => {
    apiProfilesServiceMock = {
      crud: jasmine.createSpyObj('CRUD', ['get'])
    };
    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    navControllerSpy = jasmine.createSpyObj('NavController', ['navigateForward']);
    navControllerSpy.navigateForward.and.returnValue(of({}).toPromise());
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ApiProfilesService, useValue: apiProfilesServiceMock },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: NavController, useValue: navControllerSpy }
      ]
    });
  });

  beforeEach(() => {
    profileHelperService = TestBed.get(ProfilesHelperService);
  });

  it('should be created', () => {
    expect(profileHelperService).toBeTruthy();
  });

  it('isFromGuard should return false when after call isFromGuardHasBeenCalled', () => {
    profileHelperService.isFromGuardHasBeenCalled();
    expect(profileHelperService.isFromGuard()).toBe(false);
  });

  it('shoud call get on apiProfilesService.crud when isProfileDataOk', () => {
    apiProfilesServiceMock.crud.get.and.returnValue(of());
    profileHelperService
      .isProfileDataOk()
      .subscribe(res =>
        expect(apiProfilesServiceMock.crud.get).toHaveBeenCalledTimes(1)
      );
  });

  it('isProfileDataOk shoud return true when get return { asdf: not_null_or_empty}', () => {
    apiProfilesServiceMock.crud.get.and.returnValue(of({ asdf: 'sadf' }));
    profileHelperService
      .isProfileDataOk()
      .subscribe(res =>
        expect(res).toBe(true)
      );
  });

  it('isProfileDataOk shoud return false when get return { asdf: "" }', () => {
    apiProfilesServiceMock.crud.get.and.returnValue(of({ asdf: '' }));
    profileHelperService
      .isProfileDataOk()
      .subscribe(res => expect(res).toBe(false));
  });

  it('should call navigateForward with ["/profiles/user"], on navController when get return { asdf: "" }', () => {
    apiProfilesServiceMock.crud.get.and.returnValue(of({ asdf: '' }));
    profileHelperService
      .isProfileDataOk()
      .subscribe(res => {
        expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
        expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(
          ['/profiles/user']
        );
      });
  });
});
