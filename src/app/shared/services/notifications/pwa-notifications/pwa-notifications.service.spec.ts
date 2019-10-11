import { TestBed } from '@angular/core/testing';

import { PwaNotificationsService } from './pwa-notifications.service';

describe('PwaNotificationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PwaNotificationsService = TestBed.get(PwaNotificationsService);
    expect(service).toBeTruthy();
  });
});
