import { TestBed } from '@angular/core/testing';

import { RefreshTokenInterceptorService } from './refresh-token-interceptor.service';
import {AuthService} from '../auth/auth.service';

describe('RefreshTokenInterceptorService', () => {
  let service: RefreshTokenInterceptorService;
  let authServiceSpy: any;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['checkRefreshToken', 'storedToken']);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
    service = TestBed.inject(RefreshTokenInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
