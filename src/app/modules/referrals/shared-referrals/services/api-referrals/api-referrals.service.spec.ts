import { TestBed } from '@angular/core/testing';

import { ApiReferralsService } from './api-referrals.service';
import { CrudService } from 'src/app/shared/services/crud/crud.service';

describe('ApiReferralsService', () => {
  let crudSpy: any;

  beforeEach(() => {
    crudSpy = jasmine.createSpyObj('CrudService', ['getEndpoints']);
    TestBed.configureTestingModule({
      providers: [{ provide: CrudService, useValue: crudSpy }]
    });
  });

  it('should be created', () => {
    const service: ApiReferralsService = TestBed.get(ApiReferralsService);
    expect(service).toBeTruthy();
  });
});
