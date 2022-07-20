import { TestBed } from '@angular/core/testing';

import { TokenOperationDataService } from './token-operation-data.service';

describe('BuyCriptoDataService', () => {
  let service: TokenOperationDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenOperationDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
