import { TestBed } from '@angular/core/testing';
import { PwaFirebaseLogsService } from './pwa-firebase-logs.service';

describe('PwaFirebaseLogsService', () => {
  let service: PwaFirebaseLogsService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PwaFirebaseLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not fail on method calls', () => {
    service.startTracker();
    service.trackLogin();
    service.trackSignUp();
    service.trackEvent({});
    service.trackView({});
    expect(true).toBeTruthy();
  });
});
