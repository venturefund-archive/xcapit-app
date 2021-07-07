import { TestBed } from '@angular/core/testing';

import { AcceptedToSGuard } from './accepted-tos.guard';

describe('AcceptedToSGuard', () => {
  let guard: AcceptedToSGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AcceptedToSGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
