import { TestBed } from '@angular/core/testing';

import { ApiUsuariosService } from './api-usuarios.service';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { Storage } from '@ionic/storage';
import { JwtHelperService } from '@auth0/angular-jwt';

describe('ApiUsuariosService', () => {
  let crudSpy: any;
  let customHttpServiceSpy: any;
  let storageSpy: any;
  let jwtHelperServiceSpy: any;

  beforeEach(() => {
    crudSpy = jasmine.createSpyObj('CrudService', ['getEndpoints']);
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      http: { post: () => null }
    });
    jwtHelperServiceSpy = jasmine.createSpyObj('JwtHelperService', ['isTokenExpired']);
    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set', 'remove']);
    TestBed.configureTestingModule({
      providers: [
        { provide: CrudService, useValue: crudSpy },
        { provide: CustomHttpService, useValue: customHttpServiceSpy },
        { provide: Storage, useValue: storageSpy },
        { provide: JwtHelperService, useValue: jwtHelperServiceSpy }
      ]
    });
  });

  it('should be created', () => {
    const service: ApiUsuariosService = TestBed.get(ApiUsuariosService);
    expect(service).toBeTruthy();
  });
});
