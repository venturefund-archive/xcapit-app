import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-resend-verification-email',
  template: `
    <ion-content class="ion-padding" *ngIf="this.email">
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
          <app-ux-title>{{
            'usuarios.register.resend_verification_email.title' | translate
          }}</app-ux-title>
        </div>
        <div class="main__secondary_text">
          <app-ux-text>{{
            'usuarios.register.resend_verification_email.text' | translate
          }}</app-ux-text>
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
              {{
                'usuarios.register.resend_verification_email.resend_mail_button'
                  | translate: { timer: this.timerText }
              }}
            </ion-button>
          </div>
          <div class="main__actions__secondary" *ngIf="!this.hideSendTicket">
            <ion-button
              class="ux_button"
              appTrackClickUnauth
              fill="clear"
              name="Open Ticket"
              (click)="this.openTicket()"
            >
              {{
                'usuarios.register.resend_verification_email.open_ticket_button'
                  | translate
              }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./resend-verification-email.page.scss'],
})
export class ResendVerificationEmailPage implements OnInit {
  disableResendEmail: boolean = true;
  hideSendTicket: boolean = true;

  private numberOfResends: number = 0;
  minimumNumberOfTriesForTicket: number = 3;

  timerText: string = '';
  timerSeconds: number;
  private timer: any;

  email: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiUsuariosService: ApiUsuariosService,
    private navController: NavController,
    private storage: Storage
  ) {
    this.route.queryParams.subscribe((params) => {
      const extras = this.router.getCurrentNavigation()?.extras;
      if (extras?.state && extras?.state.email) {
        this.email = extras.state.email;
        this.updateStorage();
        this.resendEmail();
      } else {
        this.checkStorage();
      }
    });
  }

  ngOnInit() {}

  async checkStorage() {
    this.storage.get('email').then(async (email) => {
      if (email) {
        this.numberOfResends = await this.storage.get('numberOfResends');
        this.canShowCreateTicket();
        this.email = email;
        this.startTimer();
      } else {
        this.close();
      }
    });
  }

  updateStorage() {
    this.updateEmailStorage();
    this.updateNumberOfResendsStorage();
  }

  updateEmailStorage() {
    this.storage.set('email', this.email);
  }

  updateNumberOfResendsStorage() {
    this.storage.set('numberOfResends', this.numberOfResends);
  }

  async startTimer() {
    this.timerSeconds = 60;
    this.timerText = `(${this.timerSeconds}s)`;
    this.disableResendEmail = true;
    this.timer = setInterval(this.decreaseTimer.bind(this), 1000);
  }

  decreaseTimer() {
    this.timerSeconds--;
    this.timerText = `(${this.timerSeconds}s)`;

    if (this.timerSeconds == 0) {
      this.timerText = '';
      clearInterval(this.timer);
      this.disableResendEmail = false;
    }
  }

  close() {
    this.clearStorage();
    this.navController.navigateForward(['/users/login']);
  }

  resendEmail() {
    this.startTimer();

    this.numberOfResends++;
    this.updateNumberOfResendsStorage();

    this.canShowCreateTicket();

    this.apiUsuariosService.resendEmailValidation(this.email).subscribe();
  }

  openTicket() {
    this.clearStorage();
    const params = { state: { email: this.email } };
    this.navController.navigateForward(['/tickets/create'], params);
  }

  canShowCreateTicket() {
    if (this.numberOfResends >= this.minimumNumberOfTriesForTicket) {
      this.hideSendTicket = false;
    }
  }

  clearStorage() {
    this.storage.remove('email');
    this.storage.remove('numberOfResends');
  }
}
