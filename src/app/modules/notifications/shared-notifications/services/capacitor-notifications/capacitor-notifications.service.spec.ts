import { TestBed } from '@angular/core/testing';

import { CapacitorNotificationsService } from './capacitor-notifications.service';

describe('CapacitorNotificationsService', () => {
  let service: CapacitorNotificationsService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  beforeEach(() => {
    service = TestBed.inject(CapacitorNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
