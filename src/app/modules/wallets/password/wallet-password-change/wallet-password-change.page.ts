import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { CONFIG } from 'src/app/config/app-constants.config';
import { ItemFormError } from 'src/app/shared/models/item-form-error';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { CustomValidatorErrors } from 'src/app/shared/validators/custom-validator-errors';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { WalletEncryptionService } from '../../shared-wallets/services/wallet-encryption/wallet-encryption.service';

@Component({
  selector: 'app-wallet-password-change',
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.password_change.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="this.changePasswordForm" class="ux_main" (ngSubmit)="this.handleSubmit()">
        <div class="ux_content wpc">
          <div class="wpc__title">
            <ion-text name="Title" class="ux-font-text-lg">{{ 'wallets.password_change.title' | translate }}</ion-text>
          </div>
          <div class="wpc__description ion-margin-top">
            <div class="wpc__description__icon">
              <ion-icon name="ux-key-outline" slot="start"></ion-icon>
            </div>
            <div class="wpc__description__text">
              <ion-text name="Description" class="ux-font-text-base">{{
                'wallets.password_change.description' | translate
              }}</ion-text>
            </div>
          </div>

          <div class="wpc__old_password">
            <app-ux-input
              class="input"
              controlName="old_password"
              type="password"
              [label]="'wallets.password_change.old_password' | translate"
              inputmode="password"
              [errors]="this.oldPasswordErrors"
            ></app-ux-input>
          </div>

          <div class="wpc__new_password">
            <app-ux-input
              class="input"
              controlName="password"
              type="password"
              [label]="'wallets.password_change.new_password' | translate"
              inputmode="password"
              [errors]="this.passwordErrors"
            ></app-ux-input>
          </div>

          <div class="wpc__repeat_password">
            <app-ux-input
              class="input"
              controlName="repeat_password"
              type="password"
              [label]="'wallets.password_change.repeat_password' | translate"
              inputmode="password"
              [errors]="this.repeatPasswordErrors"
            ></app-ux-input>
          </div>
        </div>
        <div name="Change Password Form Buttons" class="ux_footer">
          <div class="wpc__button">
            <ion-button
              class="ux_button"
              appTrackClick
              name="Submit"
              type="submit"
              color="uxsecondary"
              size="large"
              [disabled]="this.loading"
              [appLoading]="this.loading"
              [loadingText]="'wallets.password_change.loading' | translate"
            >
              {{ 'wallets.password_change.submit_button' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./wallet-password-change.page.scss'],
})
export class WalletPasswordChangePage implements OnInit {
  loading = false;
  disable = false;
  changePasswordForm: FormGroup = this.formBuilder.group(
    {
      old_password: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
          CustomValidators.patternValidator(/\d/, CustomValidatorErrors.hasNumber),
          CustomValidators.patternValidator(/[A-Z]/, CustomValidatorErrors.hasCapitalCase),
          CustomValidators.patternValidator(/[a-z]/, CustomValidatorErrors.hasSmallCase),
        ],
      ],
      repeat_password: ['', [Validators.required]],
    },
    {
      validators: [CustomValidators.passwordMatchValidator, CustomValidators.newPasswordEqualsOldValidator()],
    }
  );

  oldPasswordErrors: ItemFormError[] = [...CONFIG.fieldErrors.oldPassword];
  passwordErrors: ItemFormError[] = [...CONFIG.fieldErrors.newPassword, ...CONFIG.fieldErrors.password];
  repeatPasswordErrors: ItemFormError[] = [...CONFIG.fieldErrors.repeatPassword, ...CONFIG.fieldErrors.password];

  constructor(
    private formBuilder: FormBuilder,
    public submitButtonService: SubmitButtonService,
    private navController: NavController,
    private walletEncryptionService: WalletEncryptionService
  ) {}

  ngOnInit() {}

  async handleSubmit() {
    if (this.changePasswordForm.valid) {
      await this.changePassword();
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

  async changePassword() {
    this.loading = true;
    this.walletEncryptionService
      .changePassword(this.changePasswordForm.value.old_password, this.changePasswordForm.value.password)
      .then(() => this.navController.navigateForward(['/wallets/password-change/success']))
      .catch((error) => {
        if (error.message === 'invalid password') {
          this.showIncorrectPasswordError();
        } else {
          this.navController.navigateForward(['/wallets/password-change/error']);
        }
      })
      .finally(() => (this.loading = false));
  }

  async showIncorrectPasswordError() {
    this.changePasswordForm.get('old_password').setErrors(CustomValidatorErrors.walletIncorrectPassword);
    this.changePasswordForm.markAllAsTouched();
  }
}
