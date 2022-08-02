import { TestBed } from '@angular/core/testing';
import { PasswordErrorMsgs } from '../../models/password/password-error-msgs';

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

  it('should be called callback when error message is invalid password', () => {
    const callbackSpy = jasmine.createSpy()
    service.handlePasswordError({message: new PasswordErrorMsgs().invalid()}, callbackSpy)
    expect(callbackSpy).toHaveBeenCalledTimes(1);
  });

  it('should not be called callback when error message is invalid password', () => {
    const callbackSpy = jasmine.createSpy()
    service.handlePasswordError({message: 'valid password'}, callbackSpy)
    expect(callbackSpy).toHaveBeenCalledTimes(0);
  });

});
