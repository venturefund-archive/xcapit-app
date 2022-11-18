import { Injectable } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CountdownTimerService {
  remainingTime: number;
  private timer$: Observable<number>;
  subscription$: Subscription;

  constructor() {}

  startTimerSubscription(seconds): Observable<number> {
    if (!this.timer$) {
      this.timer$ = interval(1000);
    }
    if (this.remainingTime > 0) {
      return this.getTimerObservable();
    }
    return this.renewSubscription(seconds);
  }

  decreaseTimer() {
    this.remainingTime--;
    if (this.remainingTime < 1) {
      this.removeTimerObservable();
    }
  }

  public getCurrentTime() {
    return this.remainingTime;
  }

  getTimerObservable() {
    return this.timer$.pipe(delay(50));
  }

  removeTimerObservable() {
    this.subscription$.unsubscribe();
  }

  renewSubscription(seconds) {
    this.remainingTime = seconds;
    this.subscription$ = this.timer$.subscribe(() => {
      this.decreaseTimer();
    });
    return this.getTimerObservable();
  }
}
