import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Console } from 'console';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { RegistrationStatus } from '../enums/registration-status.enum';
import { CountdownTimerService } from '../shared-ramps/services/countdown-timer/countdown-timer.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';

@Component({
  selector: 'app-user-email',
  template: ` <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/fiat-ramps/new-operation/kripton"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.user_email.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ue__container">
      <div class="ue__container__provider">
        <ion-text class="ux-font-text-xxs">{{ 'fiat_ramps.user_email.provider' | translate }}</ion-text>
      </div>
      <div class="ue__container__icon">
        <img src="assets/img/provider-logos/KriptonMarket.svg" />
      </div>
      <div class="ue__container__title">
        <ion-text class="ux-font-text-lg">{{ 'fiat_ramps.user_email.title' | translate }}</ion-text>
      </div>
      <div class="ue__container__subtitle">
        <ion-text class="ux-font-text-base">{{ 'fiat_ramps.user_email.subtitle' | translate }}</ion-text>
      </div>
      <div class="ue__container__form">
        <form [formGroup]="this.form">
          <app-ux-input
            controlName="email"
            type="email"
            inputmode="email"
            [label]="'fiat_ramps.user_email.label_email' | translate"
            aria-label="email"
            tabindex="0"
            color="primary"
          ></app-ux-input>
          <div *ngIf="this.validateEmail">
            <ion-text class="ux-font-text-xxs">{{ 'fiat_ramps.user_email.text_token' | translate }}</ion-text>
            <div class="ue__container__form__token">
              <app-ux-input
                controlName="token"
                type="token"
                inputmode="token"
                [label]="'fiat_ramps.user_email.label_token' | translate"
                aria-label="token"
                tabindex="0"
                color="primary"
              ></app-ux-input>
            </div>
          </div>
        </form>
      </div>
      <div *ngIf="!this.validateEmail" class="ue__container__card">
        <app-backup-information-card
          [text]="'fiat_ramps.user_email.text'"
          [textClass]="'ux-home-backup-card'"
          [backgroundClass]="'ux-white-background-card'"
        >
        </app-backup-information-card>
      </div>
    </ion-content>
    <ion-footer class="ue__footer">
      <div class="ue__footer__resend-email-title">
        <ion-text class="ux-font-text-xs">
          {{ this.resendTitleText | translate }}
        </ion-text>
      </div>
      <div class="ue__footer__resend-email-link">
        <ion-text class="ux-link-xs" (click)="setTimer()">
          <!-- {{ this.resendLinkText | translate }} -->
          CLICK ACA
        </ion-text>
      </div>
      <app-countdown-timer [timerSeconds]="this.countdown" *ngIf="this.enable"></app-countdown-timer>
      <div class="ux_footer ion-padding">
        <ion-button
          class="ux_button"
          appTrackClick
          name="ux_user_mail_continue"
          color="secondary"
          size="large"
          expand="block"
          [disabled]="!this.form.valid"
          (click)="this.submit()"
        >
          {{ 'fiat_ramps.user_email.button' | translate }}
        </ion-button>
      </div>
    </ion-footer>`,
  styleUrls: ['./user-email.page.scss'],
})
export class UserEmailPage implements OnInit {
  form: UntypedFormGroup = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    token: ['', []],
  });

  //TODO: Set to false by default
  validateEmail = true;
  countdown: number;
  enable = false;
  // WIP
  // timerText = '';
  // timerSeconds: number;
  // private timer: any;
  disableResendEmail = true;

  resendLinkText: string;
  resendTitleText: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private fiatRampsService: FiatRampsService,
    private navController: NavController,
    private storageOperationService: StorageOperationService,
    private remoteConfig: RemoteConfigService,
    private toastService: ToastService,
    private translate: TranslateService,
    private countdownTimerService: CountdownTimerService
  ) {}

  ngOnInit() {
    // TODO si el timer del servicio es > 0, hacer enable y pasar el valor de timer
    if (this.countdownTimerService.getCurrentTime() > 0) {
      console.log('ongoing service timer on pagestart: ', this.countdownTimerService.getCurrentTime())
      this.enable = true;
      this.countdown = this.countdownTimerService.getCurrentTime();
    }
  }

  async submit() {
    const userStatus = await this.fiatRampsService.getOrCreateUser(this.form.value).toPromise();
    this.saveEmail();
    if (userStatus) this.validateEmail = true;
    this.tokenValidator();
    if (this.form.valid) this.redirectByStatus(userStatus.registration_status);
  }

  redirectByStatus(registrationStatus: string) {
    const url = RegistrationStatus[registrationStatus];
    this.navController.navigateForward(url);
  }

  private tokenValidator() {
    this.form.get('token').addValidators(Validators.required);
    this.form.get('token').updateValueAndValidity();
  }

  saveEmail() {
    const newData = Object.assign({ email: this.form.value.email }, this.storageOperationService.getData());
    this.storageOperationService.updateData(newData);
  }

  setTimer() {
    this.countdown = 120;
    this.enable = true;
  
  }

  setFooterText() {}

  // WIP

  // async startTimer() {
  //   if (this.timerSeconds < 1 || this.timerSeconds == null) {
  //     console.log('Timer starts')
  //     this.timerSeconds = 60;
  //     this.timerText = `(${this.timerSeconds}s)`;
  //     this.disableResendEmail = true;
  //     this.timer = setInterval(this.decreaseTimer.bind(this), 1000);
  //   }
  // }

  // decreaseTimer() {
  //   this.timerSeconds--;
  //   this.timerText = `(${this.timerSeconds}s)`;
  //   console.log('tiempo restante: ', this.timerSeconds)

  //   if (this.timerSeconds < 1) {
  //     this.timerText = '';
  //     clearInterval(this.timer);
  //     this.disableResendEmail = false;
  //     console.log("TIME'S UP!")
  //   }
  // }

  // resetTimerTest() {
  //   this.timerSeconds = 60;
  //   this.startTimer().then(() => {
  //     this.toastService.showSuccessToast({
  //       message: this.translate.instant('fiat_ramps.user_email.toast_success')
  //     })
  //   })
  //   console.log('Timer reset')
  // }
}
