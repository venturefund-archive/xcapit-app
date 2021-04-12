import { discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RefreshTimeoutService } from './refresh-timeout.service';

describe('RefreshTimeoutService', () => {
  let service: RefreshTimeoutService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: []
    });
    service = TestBed.inject(RefreshTimeoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set lockTime', () => {
    expect(service.getLockTime).toBe(10000);
    service.setLockTime = 20000;
    expect(service.getLockTime).toBe(20000);
  });

  it('should be available when time is ended', fakeAsync(() => {
    service.lock();
    tick(10001);
    expect(service.isAvailable()).toBeTrue();
  }));

  it('should be unavailable when time not ended', fakeAsync(() => {
    service.lock();
    tick(5000);
    expect(service.isAvailable()).toBeFalse();
    discardPeriodicTasks();
  }));

  it('should remaining time be 5 s after 5000 ms and lockTime is 10000 ms', fakeAsync(() => {
    service.setLockTime = 10000;
    service.lock();
    tick(5000);
    service.remainingTimeObservable.subscribe(remaining => expect(remaining).toBe(5));
    discardPeriodicTasks();
  }));

  it('should be available on unlock', fakeAsync(() => {
    service.lock();
    tick(5000);
    expect(service.isAvailable()).toBeFalse();
    service.unlock();
    expect(service.isAvailable()).toBeTrue();
    discardPeriodicTasks();
  }));

});
