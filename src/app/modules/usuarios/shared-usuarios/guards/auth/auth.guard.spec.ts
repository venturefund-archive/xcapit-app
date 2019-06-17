import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../../services/auth/auth.service';

describe('AuthGuard', () => {
  let authServiceSpy: any;
  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['checkToken']);
    TestBed.configureTestingModule({
      providers: [AuthGuard, { provide: AuthService, useValue: authServiceSpy }]
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
