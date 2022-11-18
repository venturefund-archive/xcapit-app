import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { RegistrationStatus } from '../enums/registration-status.enum';
import { CountdownTimerService } from '../shared-ramps/services/countdown-timer/countdown-timer.service';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { KriptonStorageService } from '../shared-ramps/services/kripton-storage/kripton-storage.service';
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
      <div class="ue__footer__resend-email" *ngIf="this.validateEmail">
        <div class="ue__footer__resend-email__title">
          <img [src]="this.resendIcon" />
          <ion-text class="ux-font-text-xs">
            {{ this.resendTitleText | translate }}
          </ion-text>
        </div>
        <div class="ue__footer__resend-email__link" *ngIf="!this.timerEnabled">
          <ion-text name="Send code request" class="ux-link-xs" (click)="sendCodeRequest()">
            {{ this.resendLinkText | translate }}
          </ion-text>
        </div>
        <app-countdown-timer
          [timerSeconds]="this.timerSeconds"
          *ngIf="this.timerEnabled"
          (hasFinishedCounting)="this.disableTimer()"
        ></app-countdown-timer>
      </div>
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

  validateEmail: boolean;
  timerEnabled = false;
  disableResendEmail = true;
  timerSeconds = 120;
  resendLinkText: string;
  resendTitleText: string;
  resendIcon: string;
  resendAttempts = 2;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private fiatRampsService: FiatRampsService,
    private navController: NavController,
    private storageOperationService: StorageOperationService,
    private toastService: ToastService,
    private translate: TranslateService,
    private kriptonStorage: KriptonStorageService
  ) {}

  ngOnInit() {
    this.updateFooterText();
  }

  async submit() {
    const userStatus = await this.fiatRampsService.getOrCreateUser({ email: this.form.value.email }).toPromise();
    this.saveEmail();
    if (userStatus) {
      this.validateEmail = true;
      this.timerEnabled = true;
      this.updateFooterText();
    }
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

  sendCodeRequest() {
    if (this.resendAttempts !== 0) {
      this.enableTimer();
      this.resendAttempts--;
      this.toastService.showSuccessToast({
        message: this.translate.instant('fiat_ramps.user_email.toast_success'),
      });
    } else {
      this.navController.navigateForward(['/tickets/create-support-ticket']);
    }
  }

  enableTimer() {
    this.timerEnabled = true;
    this.timerSeconds = 120;
    this.updateFooterText();
  }

  disableTimer() {
    this.timerEnabled = false;
    this.updateFooterText();
  }

  updateFooterText() {
    if (this.timerEnabled) {
      this.resendIcon = 'assets/ux-icons/ux-clock.svg';
      return (this.resendTitleText = this.translate.instant('fiat_ramps.user_email.resend_email.title_sent'));
    }
    if (!this.timerEnabled && this.resendAttempts > 0) {
      this.resendIcon = 'assets/ux-icons/ux-clock.svg';
      this.resendTitleText = this.translate.instant('fiat_ramps.user_email.resend_email.title_not_sent');
      this.resendLinkText = this.translate.instant('fiat_ramps.user_email.resend_email.link_not_sent');
    }
    if (!this.timerEnabled && this.resendAttempts === 0) {
      this.resendIcon = 'assets/ux-icons/ux-question-mark.svg';
      this.resendTitleText = this.translate.instant('fiat_ramps.user_email.resend_email.title_exceeded_attempts');
      this.resendLinkText = this.translate.instant('fiat_ramps.user_email.resend_email.link_exceeded_attempts');
    }
  }
}
