import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { millisecondsToHours, millisecondsToMinutes, millisecondsToSeconds } from 'date-fns';
import { interval, Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-timer-countdown',
  template: `
    <ion-spinner *ngIf="!this.timeString" color="dark" name="crescent"></ion-spinner>
    <div class="tc" *ngIf="this.timeString">
      <ion-icon name="clock"></ion-icon>
      <ion-text class="ux-font-text-xs">{{ this.text | translate: this.timeString }}</ion-text>
    </div>
  `,
  styleUrls: ['./timer-countdown.component.scss'],
})
export class TimerCountdownComponent implements OnInit, OnDestroy {
  @Input() text: string;
  @Input() deadlineDate: Date;
  @Input() showHours = true;
  @Input() showMinutes = true;
  @Input() showSeconds = true;
  private subscription$: Subscription;
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
    this.subscription$ = this.timer().subscribe(() => {
      this.getTimeDifference();
    });
  }

  timer(): Observable<number> {
    return interval(1000);
  }

  getTimeDifference() {
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
        ${
          (this.showHours ? this.checkFormatCondition(this.hoursToDday, this.showMinutes) : '') +
          (this.showMinutes ? this.checkFormatCondition(this.minutesToDday, this.showSeconds) : '') +
          (this.showSeconds ? this.formatValue(this.secondsToDday) : '')
        }
      `,
    };
  }

  checkFormatCondition(value: number, condition: boolean) {
    if (condition) {
      return `${this.formatValue(value)}:`;
    }
    return `${this.formatValue(value)}`;
  }

  formatValue(value: number) {
    return value < 10 ? `0${value}` : `${value}`;
  }

  unsubscribe(): void {
    this.subscription$.unsubscribe();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
