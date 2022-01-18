import { TestBed } from '@angular/core/testing';
import { NullNotificationsService } from './null-notifications.service';

describe('NullNotificationsService', () => {
  let service: NullNotificationsService;
  beforeEach(() => {});

  beforeEach(() => {
    service = TestBed.inject(NullNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
