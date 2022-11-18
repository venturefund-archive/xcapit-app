import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CountdownTimerService } from './countdown-timer.service';

describe('CountdownTimerService', () => {
  let countdownTimerService: CountdownTimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    countdownTimerService = TestBed.inject(CountdownTimerService);
    countdownTimerService.subscription$ = of({}).subscribe();
  });

  it('should be created', () => {
    expect(countdownTimerService).toBeTruthy();
  });

  it('should start a new timer if it is not already running', () => {
    const renewSpy = spyOn(countdownTimerService, 'renewSubscription').and.callThrough();
    countdownTimerService.remainingTime = undefined;
    countdownTimerService.startTimerSubscription(countdownTimerService.remainingTime);

    expect(renewSpy).toHaveBeenCalledTimes(1);
  });

  it('should not start a new timer if it is already running', () => {
    const getTimerObservablespy = spyOn(countdownTimerService, 'getTimerObservable').and.callThrough();
    countdownTimerService.remainingTime = 60;
    countdownTimerService.startTimerSubscription(countdownTimerService.remainingTime);

    expect(getTimerObservablespy).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe when timer finishes', () => {
    const removeTimerspy = spyOn(countdownTimerService, 'removeTimerObservable').and.callThrough();
    countdownTimerService.remainingTime = 1;
    countdownTimerService.decreaseTimer();

    expect(removeTimerspy).toHaveBeenCalledTimes(1);
  });

  it('should get current time remaining when getCurrentTime is called', () => {
    const getCurrentTimeSpy = spyOn(countdownTimerService, 'getCurrentTime').and.callThrough();
    countdownTimerService.remainingTime = 60;
    countdownTimerService.getCurrentTime();

    expect(getCurrentTimeSpy).toHaveBeenCalledTimes(1);
  });
});
