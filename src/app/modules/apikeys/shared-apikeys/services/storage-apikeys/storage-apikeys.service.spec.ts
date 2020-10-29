import { TestBed } from '@angular/core/testing';

import { StorageApikeysService } from './storage-apikeys.service';

describe('StorageApikeysService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StorageApikeysService = TestBed.inject(StorageApikeysService);
    expect(service).toBeTruthy();
  });
});
