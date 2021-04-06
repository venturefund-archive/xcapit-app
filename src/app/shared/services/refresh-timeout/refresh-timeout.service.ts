import { Injectable, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshTimeoutService implements OnDestroy {
  private startTime: number = null;
  private lockTime = 10000;
  private nextAvailable: number = null;
  private countdownSubscription: Subscription;
  private remainingTimeSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.toSeconds(this.lockTime));
  private isAvailableSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor() {
  }

  set setLockTime(milliseconds: number) {
    this.lockTime = milliseconds;
  }

  createSubscription() {
    this.countdownSubscription = interval(1000).subscribe(_ => {
      const seconds = this.toSeconds(this.nextAvailable - this.now());
      this.remainingTime = seconds;
      if (seconds <= 0) {
        this.available = true;
        this.countdownSubscription.unsubscribe();
      }
    });
  }

  private toSeconds(milliseconds: number): number {
    return Math.floor(milliseconds / 1000);
  }

  private now(): number {
    return moment().valueOf();
  }

  private set available(available: boolean) {
    this.isAvailableSubject.next(available);
  }

  get remainingTimeObservable(): Observable<number> {
    return this.remainingTimeSubject.asObservable();
  }

  get isAvailableObservable(): Observable<boolean> {
    return this.isAvailableSubject.asObservable();
  }

  set remainingTime(next: number) {
    this.remainingTimeSubject.next(next);
  }

  isAvailable(): boolean {
    return this.isAvailableSubject.getValue();
  }

  lock() {
    this.startTime = this.now();
    this.nextAvailable = this.startTime + this.lockTime;
    this.remainingTimeSubject.next(this.toSeconds(this.lockTime));
    this.createSubscription();
    this.available = false;
  }

  unlock() {
    this.startTime = null;
    this.nextAvailable = null;
    this.remainingTimeSubject.complete();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  unsubscribe() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
    if (this.remainingTimeSubject) {
      this.remainingTimeSubject.unsubscribe();
    }
    if (this.isAvailableSubject) {
      this.isAvailableSubject.unsubscribe();
    }
  }
}
