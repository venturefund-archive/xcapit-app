import { TestBed } from '@angular/core/testing';

import { StorageWalletsService } from './storage-wallets.service';

describe('StorageWalletsService', () => {
  let service: StorageWalletsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageWalletsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
