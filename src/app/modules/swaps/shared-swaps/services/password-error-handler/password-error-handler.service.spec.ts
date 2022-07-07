import { TestBed } from '@angular/core/testing';

import { PasswordErrorHandlerService } from './password-error-handler.service';

describe('PasswordErrorHandlerService', () => {
  let service: PasswordErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
