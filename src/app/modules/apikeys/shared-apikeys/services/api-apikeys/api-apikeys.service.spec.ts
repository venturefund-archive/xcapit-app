import { TestBed } from '@angular/core/testing';

import { ApiApikeysService } from './api-apikeys.service';
import { CrudService } from 'src/app/shared/services/crud/crud.service';

describe('ApiApikeysService', () => {
  let apiApikeysService: ApiApikeysService;
  let crudSpy: any;

  beforeEach(() => {
    crudSpy = jasmine.createSpyObj('CrudService', ['getEndpoints']);
    TestBed.configureTestingModule({
      providers: [{ provide: CrudService, useValue: crudSpy }]
    });
    apiApikeysService = TestBed.get(ApiApikeysService);
  });

  it('should be created', () => {
    expect(apiApikeysService).toBeTruthy();
  });
});
