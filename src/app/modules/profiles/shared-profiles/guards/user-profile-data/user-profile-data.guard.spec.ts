import { TestBed, inject } from '@angular/core/testing';

import { UserProfileDataGuard } from './user-profile-data.guard';
import { ProfilesHelperService } from '../../services/profiles-helper/profiles-helper.service';

describe('UserProfileDataGuard', () => {
  let profilesHelperSpy: any;
  beforeEach(() => {
    profilesHelperSpy = jasmine.createSpyObj('ProfilesHelperService', [
      'isProfileDataOk'
    ]);
    TestBed.configureTestingModule({
      providers: [
        UserProfileDataGuard,
        { provide: ProfilesHelperService, useValue: profilesHelperSpy }
      ]
    });
  });

  it('should ...', inject(
    [UserProfileDataGuard],
    (guard: UserProfileDataGuard) => {
      expect(guard).toBeTruthy();
    }
  ));
});
