import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RefreshTimeoutService {
  startTime: Date;
  private lockTime = 10000;
  private available = false;

  constructor() {
  }

  set setLockTime(time: number) {
    this.lockTime = time;
  }

  isAvailable() {
    return this.available;
  }

  lock() {}

}
