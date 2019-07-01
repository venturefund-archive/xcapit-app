import { TestBed } from '@angular/core/testing';

import { ApiFundsService } from './api-funds.service';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { of } from 'rxjs';
import { API_URL } from 'src/app/config/app-constants.config';

describe('ApiFundsService', () => {
  let crudSpy: any;
  let customHttpServiceMock: any;
  let apiFundsService: ApiFundsService;

  beforeEach(() => {
    crudSpy = jasmine.createSpyObj('CrudService', ['getEndpoints']);
    customHttpServiceMock = { http: { get: () => null } };
    TestBed.configureTestingModule({
      providers: [
        { provide: CrudService, useValue: crudSpy },
        { provide: CustomHttpService, useValue: customHttpServiceMock }
      ]
    });
    customHttpServiceMock = TestBed.get(CustomHttpService);
    apiFundsService = TestBed.get(ApiFundsService);
  });

  it('should be created', () => {
    expect(apiFundsService).toBeTruthy();
  });
});
