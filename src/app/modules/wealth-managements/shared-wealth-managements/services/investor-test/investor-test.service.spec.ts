import { TestBed } from '@angular/core/testing';

import { InvestorTestService } from './investor-test.service';

describe('InvestorTestService', () => {
  let service: InvestorTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvestorTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
