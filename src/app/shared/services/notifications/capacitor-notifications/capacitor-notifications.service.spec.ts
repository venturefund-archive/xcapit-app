import { TestBed } from '@angular/core/testing';

import { CapacitorNotificationsService } from './capacitor-notifications.service';

describe('CapacitorNotificationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CapacitorNotificationsService = TestBed.get(CapacitorNotificationsService);
    expect(service).toBeTruthy();
  });
});
