import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { millisecondsToHours, millisecondsToMinutes, millisecondsToSeconds } from 'date-fns';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-timer-countdown',
  template: `
  <div class="tc">
      <ion-icon name="clock"></ion-icon> 
      <ion-text class="ux-font-text-xs">{{ this.text | translate: this.timeString }}</ion-text>
  </div>
  `,
  styleUrls: ['./timer-countdown.component.scss'],
})
export class TimerCountdownComponent implements OnInit, OnDestroy {
  @Input() text: string;
  @Input() deadlineDate: Date;
  private subscription: Subscription;
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  secondsInAMinute = 60;
  timeDifference: number;
  minutesToDday: number;
  hoursToDday: number;
  daysToDday: number;
  secondsToDday: number;
  timeString: { value: string };

  constructor() {}

  ngOnInit() {
    this.subscription = interval(1000).subscribe((x) => {
      this.getTimeDifference();
    });
  }

  private getTimeDifference() {
    this.timeDifference = this.deadlineDate?.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference) {
    this.secondsToDday = millisecondsToSeconds(timeDifference) % this.secondsInAMinute;
    this.minutesToDday = millisecondsToMinutes(timeDifference) % this.secondsInAMinute;
    this.hoursToDday = millisecondsToHours(timeDifference);
    this.setTimeValue();
  }

  private setTimeValue() {
    this.timeString = {
      value: `
        ${this.formatValue(this.hoursToDday)}
        ${this.formatValue(this.minutesToDday)}
        ${this.secondsToDday}
      `,
    };
  }

  formatValue(value) {
    return value < 10 ? `0${value}:` : value === 0 ? '' : `${value}:`;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
