import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SubmitButtonService } from 'src/app/shared/services/submit-button/submit-button.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { CustomValidatorErrors } from 'src/app/shared/validators/custom-validator-errors';
import { ItemFormError } from 'src/app/shared/models/item-form-error';
import { CONFIG } from 'src/app/config/app-constants.config';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';

@Component({
  selector: 'app-create-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/wallets/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ 'wallets.create_password.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="this.createPasswordForm" class="ux_main" (ngSubmit)="this.handleSubmit()">
        <div class="ux_content">
          <div>
            <ion-text name="Title" class="ux-font-gilroy ux-fsize-22 ux-fweight-bold">{{
              'wallets.create_password.title' | translate
            }}</ion-text>
          </div>
          <div class="description ion-margin-top">
            <ion-text name="Description" class="ux-font-lato ux-fsize-14 ux-fweight-normal">{{
              'wallets.create_password.description' | translate
            }}</ion-text>
          </div>

          <app-ux-input
            controlName="password"
            type="password"
            [label]="'wallets.create_password.password' | translate"
            inputmode="password"
            [errors]="this.passwordErrors"
          ></app-ux-input>

          <app-ux-input
            controlName="repeat_password"
            type="password"
            [label]="'wallets.create_password.repeat_password' | translate"
            inputmode="password"
            [errors]="this.repeatPasswordErrors"
          ></app-ux-input>
        </div>
        <div name="Create Password Form Buttons" class="ux_footer">
          <div class="button">
            <ion-button
              class="ux_button"
              appTrackClick
              name="Submit"
              type="submit"
              color="uxsecondary"
              size="large"
              [disabled]="this.submitButtonService.isDisabled | async"
            >
              {{ 'wallets.create_password.finish_button' | translate }}
            </ion-button>
          </div>
        </div>
      </form>
    </ion-content>
  `,
  styleUrls: ['./create-password.page.scss'],
})
export class CreatePasswordPage implements OnInit {
  createPasswordForm: FormGroup = this.formBuilder.group(
    {
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
      validators: [CustomValidators.passwordMatchValidator],
    }
  );

  passwordErrors: ItemFormError[] = CONFIG.fieldErrors.password;

  repeatPasswordErrors: ItemFormError[] = [...CONFIG.fieldErrors.repeatPassword, ...CONFIG.fieldErrors.password];

  constructor(
    private formBuilder: FormBuilder,
    public submitButtonService: SubmitButtonService,
    private navController: NavController,
    private translate: TranslateService,
    private walletEncryptionService: WalletEncryptionService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {}

  handleSubmit() {
    if (this.createPasswordForm.valid) {
      this.loadingService.show();
      const password = this.createPasswordForm.value.password;
      this.walletEncryptionService.encryptWallet(password).then((res) => {
        this.loadingService.dismiss();
        this.navController.navigateForward(['/wallets/success-creation']);
      });
    } else {
      this.createPasswordForm.markAllAsTouched();
    }
  }
}
