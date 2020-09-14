import { TestBed } from '@angular/core/testing';
import { ApiDaService } from './api-da.service';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService } from '@auth0/angular-jwt';

describe('ApiDaService', () => {
  let crudSpy: any;
  let customHttpServiceSpy: any;
  let apiDaService: ApiDaService;
  let storageSpy: any;
  let jwtHelperServiceSpy: any;
  let service: ApiDaService;
  let serviceHttp: CustomHttpService;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('Storage', ['get']);
    jwtHelperServiceSpy = jasmine.createSpyObj('JwtHelperService', [
      'isTokenExpired'
    ]);
    crudSpy = jasmine.createSpyObj('CrudService', ['getEndpoints']);
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      get: of({})
    });

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: CrudService, useValue: crudSpy },
        { provide: CustomHttpService, useValue: customHttpServiceSpy },
        { provide: Storage, useValue: storageSpy },
        { provide: JwtHelperService, useValue: jwtHelperServiceSpy }
      ]
    });
    customHttpServiceSpy = TestBed.get(CustomHttpService);
    apiDaService = TestBed.get(ApiDaService);
  });

  beforeEach(() => {
    service = TestBed.get(ApiDaService);
    serviceHttp = TestBed.get(CustomHttpService)
  });

  it('should be created', () => {
    expect(apiDaService).toBeTruthy();
  });

  it('should be call get on http when getDepositAddress', () => {
    service.getDepositAddress('BTC').subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });
});
