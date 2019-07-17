import { TestBed } from '@angular/core/testing';

import { ApiFundsService } from './api-funds.service';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { of } from 'rxjs';

describe('ApiFundsService', () => {
  let crudSpy: any;
  let customHttpServiceSpy: any;
  let apiFundsService: ApiFundsService;

  beforeEach(() => {
    crudSpy = jasmine.createSpyObj('CrudService', ['getEndpoints']);
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      http: { get: () => null },
      getFundRuns: () => of(null),
      pauseFundRuns: () => of(null),
      resumeFundRuns: () => of(null),
      finalizeFundRuns: () => of(null),
      getSubscribedFund: () => of(null),
      changeFundCA: () => of(null)
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: CrudService, useValue: crudSpy },
        { provide: CustomHttpService, useValue: customHttpServiceSpy }
      ]
    });
    customHttpServiceSpy = TestBed.get(CustomHttpService);
    apiFundsService = TestBed.get(ApiFundsService);
  });

  it('should be created', () => {
    expect(apiFundsService).toBeTruthy();
  });
});
