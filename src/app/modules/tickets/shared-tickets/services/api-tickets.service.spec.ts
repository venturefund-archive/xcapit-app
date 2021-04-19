import { TestBed } from '@angular/core/testing';
import { CrudService } from 'src/app/shared/services/crud/crud.service';

import { ApiTicketsService } from './api-tickets.service';

describe('ApiTicketsService', () => {
  let service: ApiTicketsService;
  let crudSpy: any;

  beforeEach(() => {
    crudSpy = jasmine.createSpyObj('CrudService', ['getEndpoints']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: CrudService, useValue: crudSpy }
      ]
    });
    service = TestBed.inject(ApiTicketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
