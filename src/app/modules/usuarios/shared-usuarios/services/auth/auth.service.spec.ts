import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { Storage } from '@ionic/storage';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RouterTestingModule } from '@angular/router/testing';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let storageSpy: any;
  let jwtHelperServiceSpy: any;
  let crudSpy: any;
  let customHttpServiceSpy: any;
  beforeEach(() => {
    crudSpy = jasmine.createSpyObj('CrudService', ['getEndpoints']);
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', ['post']);
    customHttpServiceSpy.post.and.returnValue(of({}));
    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set', 'remove']);
    jwtHelperServiceSpy = jasmine.createSpyObj('JwtHelperService', ['isTokenExpired']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: CrudService, useValue: crudSpy },
        { provide: CustomHttpService, useValue: customHttpServiceSpy },
        { provide: Storage, useValue: storageSpy },
        { provide: JwtHelperService, useValue: jwtHelperServiceSpy },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be call post on http when refresh token', () => {
    service.refreshToken({}).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });
});
