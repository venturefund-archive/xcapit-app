import { TestBed } from '@angular/core/testing';

import { ApiTacService } from './api-tac.service';
import { CrudService } from 'src/app/shared/services/crud/crud.service';

describe('ApiTacService', () => {
  let crudSpy: any;

  beforeEach(() => {
    crudSpy = jasmine.createSpyObj('CrudService', ['getEndpoints']);
    TestBed.configureTestingModule({
      providers: [{ provide: CrudService, useValue: crudSpy }]
    });
  });

  it('should be created', () => {
    const service: ApiTacService = TestBed.get(ApiTacService);
    expect(service).toBeTruthy();
  });
});
