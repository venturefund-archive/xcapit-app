import { TestBed } from '@angular/core/testing';

import {  NewLogin } from './new-login.guard';

describe('NewLogin', () => {
  let newLogin: NewLogin;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [newLogin],
    });
  });

  beforeEach(() => {
    newLogin = TestBed.inject(NewLogin);
  });

  it('should ...', () => {
    expect(newLogin).toBeTruthy();
  });

});
