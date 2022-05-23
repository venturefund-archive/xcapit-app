import { TestBed } from '@angular/core/testing';

import { SendDonationDataService } from './send-donation-data.service';

describe('SendDonationDataService', () => {
  let service: SendDonationDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendDonationDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
