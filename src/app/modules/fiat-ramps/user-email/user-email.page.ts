import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { RegistrationStatus } from '../enums/registration-status.enum';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { KriptonStorageService } from '../shared-ramps/services/kripton-storage/kripton-storage.service';
import { KriptonLoginSuccessResponse } from '../shared-ramps/interfaces/kripton-login-success-response';
import { TokenOperationDataService } from '../shared-ramps/services/token-operation-data/token-operation-data.service';

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
      <div class="ue__container__title">
        <ion-text class="ux-font-text-lg">{{
          (this.validatedEmail ? 'fiat_ramps.user_email.secondary_title' : 'fiat_ramps.user_email.main_title')
            | translate
        }}</ion-text>
      </div>
      <div class="ue__container__subtitle">
        <ion-text class="ux-font-text-base">{{
          (this.validatedEmail ? 'fiat_ramps.user_email.secondary_subtitle' : 'fiat_ramps.user_email.main_subtitle')
            | translate
        }}</ion-text>
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
          <div *ngIf="this.validatedEmail">
            <div [ngClass]="this.loginError ? 'ue__container__form__token_error' : 'ue__container__form__token'">
              <app-ux-input
                controlName="token"
                type="token"
                inputmode="token"
                [label]="'fiat_ramps.user_email.label_token' | translate"
                aria-label="token"
                tabindex="0"
                color="primary"
              ></app-ux-input>
              <div *ngIf="this.loginError" class="ue__container__form__token_error__description">
                <ion-icon name="ux-error-circle-outline"></ion-icon>
                <ion-text class="ux-font-text-xxs">{{
                  'fiat_ramps.user_email.token_error_description' | translate
                }}</ion-text>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div *ngIf="!this.validatedEmail" class="ue__container__card">
        <app-backup-information-card
          [text]="'fiat_ramps.user_email.text'"
          [textClass]="'ux-home-backup-card'"
          [backgroundClass]="'ux-white-background-card'"
        >
        </app-backup-information-card>
      </div>
    </ion-content>
    <ion-footer class="ue__footer">
      <div>
        <div class="ue__footer__resend-email" *ngIf="this.validatedEmail">
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
      </div>
    </ion-footer>`,
  styleUrls: ['./user-email.page.scss'],
})
export class UserEmailPage {
  form: UntypedFormGroup = this.formBuilder.group({
    email: ['', [Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9._%+-]{2,}[.][A-Za-z]{2,}$'), Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    token: ['', []],
  });
  userStatus: string;
  validatedEmail: boolean;
  timerEnabled = false;
  disableResendEmail = true;
  timerSeconds = 120;
  resendLinkText: string;
  resendTitleText: string;
  resendIcon: string;
  resendAttempts = 2;
  loginError = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private fiatRampsService: FiatRampsService,
    private navController: NavController,
    private toastService: ToastService,
    private translate: TranslateService,
    private kriptonStorage: KriptonStorageService,
    private tokenOperationDataService: TokenOperationDataService
  ) {}

  async ionViewWillEnter() {
    this.updateFooterText();
    await this.getUserEmail();
  }

  async getUserEmail() {
    const registeredEmail = await this.kriptonStorage.get('email');
    this.setInputEmail(registeredEmail);
  }

  setInputEmail(registeredEmail: string) {
    this.form.patchValue({ email: registeredEmail });
  }

  async validateEmailAndSendToken(): Promise<void> {
    this.userStatus = (
      await this.fiatRampsService.getOrCreateUser({ email: this.form.value.email }).toPromise()
    ).registration_status;
    this.fiatRampsService.getKriptonAccessToken({ email: this.form.value.email }).subscribe();
    if (this.userStatus) {
      this.validatedEmail = true;
      this.timerEnabled = true;
      this.updateFooterText();
    }
    this.addTokenValidators();
  }

  async validateTokenAndLogIn(): Promise<void> {
    this.fiatRampsService
      .kriptonLogin({ ...this.form.value })
      .toPromise()
      .then((response: KriptonLoginSuccessResponse) => {
        this.saveUserInfo(response.token, response.refresh_token);
        this.redirectByStatus(this.userStatus);
      })
      .catch(() => {
        this.loginError = true;
        this.form.get('token').valueChanges.subscribe(() => (this.loginError = false));
      });
  }

  async submit(): Promise<void> {
    !this.validatedEmail ? this.validateEmailAndSendToken() : this.validateTokenAndLogIn();
  }

  redirectByStatus(registrationStatus: string) {
    if (!this.tokenOperationDataService.tokenOperationData?.mode) {
      return this.navController.navigateRoot('/fiat-ramps/purchases');
    } else if (this.tokenOperationDataService.tokenOperationData.mode === 'sell' && registrationStatus === 'COMPLETE') {
      return this.navController.navigateRoot('/fiat-ramps/user-bank-account');
    }
    const url = RegistrationStatus[registrationStatus];
    return this.navController.navigateRoot(url);
  }

  private addTokenValidators(): void {
    this.form.get('token').addValidators(Validators.required);
    this.form.get('token').updateValueAndValidity();
  }

  saveUserInfo(accessToken: string, refreshToken: string): void {
    this.kriptonStorage.set('email', this.form.value.email);
    this.kriptonStorage.set('access_token', accessToken);
    this.kriptonStorage.set('refresh_token', refreshToken);
    this.kriptonStorage.set('user_status', this.userStatus);
  }

  sendCodeRequest(): void {
    if (this.resendAttempts !== 0) {
      this.fiatRampsService.getKriptonAccessToken({ email: this.form.value.email });
      this.enableTimer();
      this.resendAttempts--;
      this.toastService.showSuccessToast({
        message: this.translate.instant('fiat_ramps.user_email.toast_success'),
      });
    } else {
      this.navController.navigateForward(['/tickets/create-support-ticket']);
    }
  }

  enableTimer(): void {
    this.timerEnabled = true;
    this.timerSeconds = 120;
    this.updateFooterText();
  }

  disableTimer(): void {
    this.timerEnabled = false;
    this.updateFooterText();
  }

  updateFooterText(): void {
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
