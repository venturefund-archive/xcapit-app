import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CountdownTimerService } from '../../services/countdown-timer/countdown-timer.service';

@Component({
  selector: 'app-countdown-timer',
  template: `
    <div>
      <ion-text class="ux-font-text-xs">
        {{ this.countdownTimerService.getCurrentTime() * 1000 | date: 'mm:ss' }}
      </ion-text>
    </div>
  `,
  styleUrls: ['./countdown-timer.component.scss'],
})
export class CountdownTimerComponent implements OnInit {
  @Input() timerSeconds: number;
  serviceTimer: number;
  constructor(
    public countdownTimerService: CountdownTimerService
  ) {}

  ngOnInit() {
    this.serviceTimer = this.countdownTimerService.getCurrentTime();
    //TODO: Evitar cuenta doble
    // if (this.serviceTimer )
    this.countdownTimerService.startTimer(this.timerSeconds);
  }
}
