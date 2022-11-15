import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountdownTimerService { 
  private remainingTime: number;
  private timer: any;

  constructor() { }
  
  //TODO: ADD UNIQUE NAME CONTROL
  startTimer(seconds) {
    this.remainingTime = seconds
    if (this.remainingTime !== undefined) {
      this.timer = setInterval(this.decreaseTimer.bind(this), 1000);
    } else {
      console.log('timerSeconds is undefined');
    }
  }

  decreaseTimer() {
    this.remainingTime--;

    if (this.remainingTime < 1) {
      clearInterval(this.timer);
    }
  }
  
  checkRetries() {
  }

  public getCurrentTime() {
    return this.remainingTime;
  }
}


