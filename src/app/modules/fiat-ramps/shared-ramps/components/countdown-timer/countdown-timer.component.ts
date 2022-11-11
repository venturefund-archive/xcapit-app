import { Component, Input, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-countdown-timer',
  template: `
    <div *ngIf="this.isVisible">
      TIMER GOES HERE
      <div class="main__actions__primary">
        <ion-text color="secondary" class="ux-font-text-xs" appTrackClick name="Timer">
          <!-- {{ 'fiat_ramps.user_email.wip_timer_text' | translate: { timer: this.timerText } | date: 'h:mm:ss' }} -->
          {{ 'fiat_ramps.user_email.wip_timer_text' | translate }}
        </ion-text>
        <ion-text class="ux-font-text-xs">
          {{ this.remainingTime *1000 | date: 'mm:ss'}}
        </ion-text>
      </div>
    </div>
  `,
  styleUrls: ['./countdown-timer.component.scss'],
})
export class CountdownTimerComponent implements OnInit, OnChanges {
  @Input() timerSeconds: number;
  remainingTime: number;
  private timer: any;
  timerText: string;
  isVisible = false;
  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    this.startTimer();
  }

  async startTimer() {
    console.log('init startTimer');
    if (this.timerSeconds !== undefined) {
      console.log('timerSeconds not equal undefined');
      this.remainingTime = this.timerSeconds;
      console.log('changes detected');
      console.log('remainingTime: ', this.remainingTime);
      console.log('timerSeconds: ', this.timerSeconds);
      this.isVisible = true;
      console.log('Timer starts');
      this.timer = setInterval(this.decreaseTimer.bind(this), 1000);
    } else {
      console.log('timerSeconds is undefined');
    }
  }

  decreaseTimer() {
    this.remainingTime--;
    console.log('tiempo restante: ', this.remainingTime);

    if (this.remainingTime < 1) {
      this.isVisible = false;
      clearInterval(this.timer);
      console.log("TIME'S UP!");
    }
  }
}
