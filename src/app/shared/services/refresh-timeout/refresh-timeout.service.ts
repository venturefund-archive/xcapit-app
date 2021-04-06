import { Injectable} from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RefreshTimeoutService {
  private startTime: number = null;
  private lockTime = 10000;
  private nextAvailable: number = null;
  private subscription: Subscription;
  public remainingTime : BehaviorSubject<number> = new BehaviorSubject(this.lockTime/1000);

  

  constructor() {
  }


  set setLockTime(time: number) {
    this.lockTime = time;
  }

  createSubscription(){
    this.subscription = interval(1000).subscribe((x) => {
      const seconds = Math.floor((this.nextAvailable - moment().valueOf())/1000)
      this.remainingTime.next(seconds);
      if(seconds <= 0 ){
        this.subscription.unsubscribe();
      }
    });
  }

  isAvailable(): boolean {
    const now = moment().valueOf();
    if(!this.startTime ){
      return true;
    }
    return now >= this.nextAvailable;
  }

  lock() {
    this.startTime = moment().valueOf();
    this.nextAvailable = this.startTime + this.lockTime;
    this.remainingTime.next(this.lockTime/1000); 
    this.createSubscription();
  }

  unlock() {
    this.startTime = null;
    this.nextAvailable = null;
  }
}
