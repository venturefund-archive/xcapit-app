import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { CountdownTimerService } from '../../services/countdown-timer/countdown-timer.service';

@Component({
  selector: 'app-countdown-timer',
  template: `
    <div>
      <ion-text class="ux-font-text-xs">
        {{ this.serviceTimer * 1000 | date: 'mm:ss' }}
      </ion-text>
    </div>
  `,
  styleUrls: ['./countdown-timer.component.scss'],
})
export class CountdownTimerComponent implements OnInit, OnDestroy {
  @Input() timerSeconds: number;
  @Output() hasFinishedCounting = new EventEmitter<void>();
  serviceTimer: number;
  subscriptionTimer$: Subscription;
  constructor(public countdownTimerService: CountdownTimerService) {}

  ngOnInit() {
    if (this.countdownTimerService.getCurrentTime() > 0) {
      this.serviceTimer = this.countdownTimerService.getCurrentTime();
    } else {
      this.serviceTimer = this.timerSeconds;
    }
    this.subscriptionTimer$ = this.countdownTimerService.startTimerSubscription(this.timerSeconds).subscribe(() => {
      this.serviceTimer = this.countdownTimerService.getCurrentTime();
      if (this.serviceTimer === 0) {
        this.hasFinishedCounting.emit();
      }
    });
  }

  ngOnDestroy() {
    this.subscriptionTimer$.unsubscribe();
  }
}
