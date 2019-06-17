import { TestBed } from '@angular/core/testing';

import { ApiFundsService } from './api-funds.service';
import { CrudService } from 'src/app/shared/services/crud/crud.service';

describe('ApiFundsService', () => {
  let crudSpy: any;

  beforeEach(() => {
    crudSpy = jasmine.createSpyObj('CrudService', ['getEndpoints']);
    TestBed.configureTestingModule({
      providers: [
        { provide: CrudService, useValue: crudSpy }
      ]
    });
  });

  it('should be created', () => {
    const service: ApiFundsService = TestBed.get(ApiFundsService);
    expect(service).toBeTruthy();
  });
});
