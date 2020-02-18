import { TestBed } from '@angular/core/testing';

import { FundDataStorageService } from './fund-data-storage.service';

describe('FundDataStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FundDataStorageService = TestBed.get(FundDataStorageService);
    expect(service).toBeTruthy();
  });
});
