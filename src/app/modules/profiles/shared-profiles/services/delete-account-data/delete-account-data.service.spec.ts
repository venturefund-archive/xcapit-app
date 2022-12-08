import { TestBed } from '@angular/core/testing';

import { DeleteAccountDataService } from './delete-account-data.service';

describe('DeleteAccountDataService', () => {
  let service: DeleteAccountDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteAccountDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
