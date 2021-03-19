import { TestBed } from '@angular/core/testing';

import { ApiApikeysService } from './api-apikeys.service';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { of } from 'rxjs';
import { CustomHttpService } from '../../../../../shared/services/custom-http/custom-http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('ApiApikeysService', () => {
  let apiApikeysService: ApiApikeysService;
  let crudSpy: any;
  let customHttpServiceSpy: any;

  beforeEach(() => {
    crudSpy = jasmine.createSpyObj('CrudService', ['getEndpoints']);
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      post: of({}),
      get: of({}),
      put: of({})
    });
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: CrudService, useValue: crudSpy }
        ]
    });
    apiApikeysService = TestBed.inject(ApiApikeysService);
    customHttpServiceSpy = TestBed.inject(CustomHttpService);
  });

  it('should be created', () => {
    expect(apiApikeysService).toBeTruthy();
  });

  it('should be call get on http when getByFundName', () => {
    apiApikeysService.getByFundName('test').subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

});
