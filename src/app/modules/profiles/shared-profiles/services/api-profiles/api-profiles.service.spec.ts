import { TestBed } from '@angular/core/testing';

import { ApiProfilesService } from './api-profiles.service';
import { CrudService } from 'src/app/shared/services/crud/crud.service';

describe('ApiProfilesService', () => {
  let crudSpy: any;

  beforeEach(() => {
    crudSpy = jasmine.createSpyObj('CrudService', ['getEndpoints']);
    TestBed.configureTestingModule({
      providers: [{ provide: CrudService, useValue: crudSpy }]
    });
  });

  it('should be created', () => {
    const service: ApiProfilesService = TestBed.get(ApiProfilesService);
    expect(service).toBeTruthy();
  });
});
