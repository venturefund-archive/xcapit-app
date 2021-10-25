import { TestBed } from '@angular/core/testing';

import { ApiUsuariosService } from './api-usuarios.service';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { Storage } from '@ionic/storage';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from '../auth/auth.service';

describe('ApiUsuariosService', () => {
  let service: ApiUsuariosService;
  let crudSpy: any;
  let customHttpServiceSpy: any;
  let storageSpy: any;
  let jwtHelperServiceSpy: any;
  let authServiceSpy: any;

  beforeEach(() => {
    crudSpy = jasmine.createSpyObj('CrudService', ['getEndpoints']);
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', ['post', 'get', 'put']);
    customHttpServiceSpy.put.and.returnValue(of({}));
    customHttpServiceSpy.get.and.returnValue(of({}));
    customHttpServiceSpy.post.and.returnValue(of({}));
    jwtHelperServiceSpy = jasmine.createSpyObj('JwtHelperService', ['isTokenExpired']);
    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set', 'remove']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['handleLoginResponse']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CrudService, useValue: crudSpy },
        { provide: CustomHttpService, useValue: customHttpServiceSpy },
        { provide: Storage, useValue: storageSpy },
        { provide: JwtHelperService, useValue: jwtHelperServiceSpy },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ApiUsuariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call post on http when resetPassword', () => {
    service.resetPassword({}).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call post on http when sendResetPasswordEmail', () => {
    service.sendResetPasswordEmail({}).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call post on http when login', () => {
    service.login({}).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
      expect(authServiceSpy.handleLoginResponse).toHaveBeenCalledTimes(1);
    });
  });

  it('should call post on http when loginWithGoogle', () => {
    service.loginWithGoogle('').subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call post on http when sendEmailValidation', () => {
    service.sendEmailValidation('').subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call post on http when sendEmailValidationByEmail', () => {
    service.sendEmailValidationByEmail('').subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call post on http when emailValidation', () => {
    service.emailValidation('', '').subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call post on http when changePassword', () => {
    service.changePassword({}).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call get on http when getUser', () => {
    service.getUser().subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should call get on http when status', () => {
    service.status().subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should call put on http when set language', () => {
    service.setLanguage('es').subscribe(() => {
      expect(customHttpServiceSpy.put).toHaveBeenCalledTimes(1);
    });
  });
});
