import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { Storage } from '@ionic/storage';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthService', () => {
  let storageSpy: any;
  let jwtHelperServiceSpy: any;
  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set', 'remove']);
    jwtHelperServiceSpy = jasmine.createSpyObj('JwtHelperService', [
      'isTokenExpired'
    ]);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: Storage, useValue: storageSpy },
        { provide: JwtHelperService, useValue: jwtHelperServiceSpy }
      ]
    });
  });

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});
