import { TestBed, async, inject } from '@angular/core/testing';

import { NoAuthGuard } from './no-auth.guard';
import { AuthService } from '../../services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('NoAuthGuard', () => {
  let authServiceSpy: any;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['checkToken']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [NoAuthGuard, { provide: AuthService, useValue: authServiceSpy }]
    });
  });

  it('should ...', inject([NoAuthGuard], (guard: NoAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
