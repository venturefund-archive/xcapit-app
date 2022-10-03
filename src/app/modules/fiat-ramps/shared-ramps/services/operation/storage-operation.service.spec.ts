import { TestBed } from '@angular/core/testing';
import { rawOperationData } from '../../fixtures/raw-operation-data';

import { StorageOperationService } from './storage-operation.service';

describe('StorageOperationService', () => {
  let service: StorageOperationService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update and access data', () => {
    service.updateData(rawOperationData);
    expect(service.getData()).toEqual(rawOperationData);
  });
});
