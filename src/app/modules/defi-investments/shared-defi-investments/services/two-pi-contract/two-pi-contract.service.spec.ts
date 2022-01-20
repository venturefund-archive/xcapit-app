import { TestBed } from '@angular/core/testing';

import { TwoPiContractService } from './two-pi-contract.service';

describe('TwoPiContractService', () => {
  let service: TwoPiContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TwoPiContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
