import { TestBed } from '@angular/core/testing';

import { ApiUsuariosService } from './api-usuarios.service';
import { CrudService } from 'src/app/shared/services/crud/crud.service';

describe('ApiUsuariosService', () => {

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
    const service: ApiUsuariosService = TestBed.get(ApiUsuariosService);
    expect(service).toBeTruthy();
  });
});
