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
          <ion-button fill="clear" appTrackClick name="Close Resend Email" (click)="this.close()">
            <ion-icon class="main__close_button__icon" name="ux-close" color="uxsemidark"></ion-icon>
          </ion-button>
        </div>
        <div class="main__ux_success_image">
          <app-ux-center-img></app-ux-center-img>
        </div>
        <div class="main__primary_text">
          <ion-text class="ux-font-text-xl">{{
            'usuarios.register.resend_verification_email.title' | translate
          }}</ion-text>
        </div>
        <div class="main__secondary_text">
          <ion-text class="ux-font-text-xs">{{
            'usuarios.register.resend_verification_email.text' | translate
          }}</ion-text>
        </div>
        <div class="main__actions">
          <div class="main__actions__primary">
            <ion-button
              color="uxsecondary"
              class="ux_button"
              appTrackClick
              name="Resend Verification Email"
              [disabled]="this.disableResendEmail"
              (click)="this.resendEmail()"
            >
              {{
                'usuarios.register.resend_verification_email.resend_mail_button' | translate: { timer: this.timerText }
              }}
            </ion-button>
          </div>
          <div class="main__actions__secondary" *ngIf="!this.hideSendTicket">
            <ion-button class="ux-link-xl" appTrackClick fill="clear" name="Open Ticket" (click)="this.openTicket()">
              {{ 'usuarios.register.resend_verification_email.open_ticket_button' | translate }}
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./resend-verification-email.page.scss'],
})
export class ResendVerificationEmailPage implements OnInit {
  disableResendEmail = true;
  hideSendTicket = true;

  private numberOfResends = 0;
  minimumNumberOfTriesForTicket = 3;

  timerText = '';
  timerSeconds: number;
  private timer: any;

  email: string;

  constructor(
    private route: ActivatedRoute,
    private apiUsuariosService: ApiUsuariosService,
    private navController: NavController,
    private storage: Storage
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.email = this.route.snapshot.paramMap.get('email');
    if (this.email) {
      this.updateStorage();
      this.resendEmail();
    } else {
      this.checkStorage();
    }
  }

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

    if (this.timerSeconds === 0) {
      this.timerText = '';
      clearInterval(this.timer);
      this.disableResendEmail = false;
    }
  }

  close() {
    this.clearStorage();
    this.navController.navigateBack(['/users/login']);
  }

  async resendEmail() {
    this.disableResendEmail = true;
    this.numberOfResends++;
    this.updateNumberOfResendsStorage();
    this.canShowCreateTicket();

    this.apiUsuariosService.sendEmailValidationByEmail(this.email).subscribe(
      () => {
        this.startTimer();
      },
      () => (this.disableResendEmail = false)
    );
  }

  openTicket() {
    this.clearStorage();

    this.navController.navigateForward(['/tickets/create', this.email]);
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
