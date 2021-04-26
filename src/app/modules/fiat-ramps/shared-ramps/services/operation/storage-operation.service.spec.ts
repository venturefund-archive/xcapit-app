import { TestBed } from '@angular/core/testing';

import { StorageOperationService } from './storage-operation.service';

describe('StorageOperationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StorageOperationService = TestBed.inject(StorageOperationService);
    expect(service).toBeTruthy();
  });
});
