import { TestBed } from '@angular/core/testing';

import { ProfilesHelperService } from './profiles-helper.service';
import { of } from 'rxjs';
import { ApiProfilesService } from '../api-profiles/api-profiles.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProfilesHelperService', () => {
  let apiProfilesServiceSpy: any;
  beforeEach(() => {
    apiProfilesServiceSpy = jasmine.createSpyObj('ApiProfilesService', {
      crud: { get: () => of({}) }
    });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ApiProfilesService, useValue: apiProfilesServiceSpy }
      ]
    });
  });

  it('should be created', () => {
    const service: ProfilesHelperService = TestBed.get(ProfilesHelperService);
    expect(service).toBeTruthy();
  });
});
