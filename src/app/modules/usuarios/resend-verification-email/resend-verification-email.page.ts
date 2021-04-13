import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

@Component({
  selector: 'app-resend-verification-email',
  template: `
    <ion-content class="ion-padding">
    <div class="main">
      <div class="main__close_button">
        <ion-button
          fill="clear"
          appTrackClickUnauth
          name="Close Resend Email"
          (click)="this.close()"
        >
          <ion-icon
            class="main__close_button__icon"
            name="ux-close"
            color="uxmedium"
          ></ion-icon>
        </ion-button>
      </div>
      <div class="main__ux_success_image">
        <app-ux-success-img></app-ux-success-img>
      </div>
      <div class="main__primary_text">
        <app-ux-title>{{ "usuarios.register.resend_verification_email.title" | translate }}</app-ux-title>
      </div>
      <div class="main__secondary_text">
        <app-ux-text>{{ "usuarios.register.resend_verification_email.text" | translate }}</app-ux-text>
      </div>
      <div class="main__actions">
        <div class="main__actions__primary">
          <ion-button
            class="ux_button"
            appTrackClickUnauth
            name="Resend Verification Email"
            [disabled]="this.disableResendEmail"
            (click)="this.resendEmail()"
          >
            {{ ("usuarios.register.resend_verification_email.resend_mail_button" | translate) + " " + this.timerText }}
          </ion-button>
        </div>
        <div
          class="main__actions__secondary"
          *ngIf="!this.hideSendTicket"
        >
          <ion-button
            class="ux_button"
            appTrackClickUnauth
            fill="clear"
            name="Open Ticket"
            (click)="this.openTicket()"
          >
            {{ "usuarios.register.resend_verification_email.open_ticket_button" | translate }}
          </ion-button>
        </div>
      </div>
    </div>
    </ion-content>
  `,
  styleUrls: ['./resend-verification-email.page.scss'],
})
export class ResendVerificationEmailPage implements OnInit {
  urlClose: string = '/users/login';
  urlOpenTicket: string = '/users/openTicket';
  disableResendEmail: boolean = true;
  hideSendTicket: boolean = true;
  numberOfResends: number = 1;
  minimumNumberOfTriesForTicket: number = 3;
  timerText: string = '';
  timerSeconds: number;
  timer: any;
  
  constructor(private router: Router) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.startTimer();
  }

  async startTimer() {
    this.timerSeconds = 60;
    this.timerText = `(${this.timerSeconds}s)`;
    this.disableResendEmail = true;
    this.timer = setInterval(this.decreaseTimer.bind(this), 1000);
  }

  decreaseTimer() {
    this.timerSeconds --;
    this.timerText = `(${this.timerSeconds}s)`;

    if (this.timerSeconds == 0) {
      this.timerText = '';
      clearInterval(this.timer);
      this.disableResendEmail = false;
    }
  }

  close() {
    this.router.navigate([this.urlClose]);
  }

  resendEmail() {
    this.startTimer();

    this.numberOfResends ++;

    if (this.numberOfResends == this.minimumNumberOfTriesForTicket) {
      this.hideSendTicket = false;
    }
  }

  openTicket() {
    this.router.navigate([this.urlOpenTicket]);
  }
}
