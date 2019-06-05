import { TestBed } from '@angular/core/testing';

import { ApiUsuariosService } from './api-usuarios.service';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';

describe('ApiUsuariosService', () => {
  let crudSpy: any;
  let customHttpServiceSpy: any;

  beforeEach(() => {
    crudSpy = jasmine.createSpyObj('CrudService', ['getEndpoints']);
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      http: { post: () => null }
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: CrudService, useValue: crudSpy },
        { provide: CustomHttpService, useValue: customHttpServiceSpy }
      ]
    });
  });

  it('should be created', () => {
    const service: ApiUsuariosService = TestBed.get(ApiUsuariosService);
    expect(service).toBeTruthy();
  });
});
