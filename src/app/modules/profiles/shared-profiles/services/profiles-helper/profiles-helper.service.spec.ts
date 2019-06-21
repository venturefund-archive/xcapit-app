import { TestBed } from '@angular/core/testing';

import { ProfilesHelperService } from './profiles-helper.service';
import { of } from 'rxjs';
import { ApiProfilesService } from '../api-profiles/api-profiles.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';

describe('ProfilesHelperService', () => {
  let apiProfilesServiceSpy: any;
  let translateServiceSpy: any;

  beforeEach(() => {
    apiProfilesServiceSpy = jasmine.createSpyObj('ApiProfilesService', {
      crud: { get: () => of({}) }
    });
    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ApiProfilesService, useValue: apiProfilesServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
      ]
    });
  });

  it('should be created', () => {
    const service: ProfilesHelperService = TestBed.get(ProfilesHelperService);
    expect(service).toBeTruthy();
  });
});
