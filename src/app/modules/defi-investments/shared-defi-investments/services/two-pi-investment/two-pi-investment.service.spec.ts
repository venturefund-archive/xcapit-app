import { TestBed } from '@angular/core/testing';

import { TwoPiInvestmentService } from './two-pi-investment.service';

describe('TwoPiInvestmentService', () => {
  let service: TwoPiInvestmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TwoPiInvestmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
