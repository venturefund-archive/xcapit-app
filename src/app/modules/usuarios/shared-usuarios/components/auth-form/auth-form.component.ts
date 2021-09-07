import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { CustomValidatorErrors } from 'src/app/shared/validators/custom-validator-errors';
import { CONFIG } from 'src/app/config/app-constants.config';
import { ItemFormError } from 'src/app/shared/models/item-form-error';

@Component({
  selector: 'app-auth-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()">
        <app-ux-input
          controlName="email"
          type="email"
          inputmode="email"
          label="Email"
          [placeholder]="'usuarios.login.email_placeholder_label' | translate"
          [errors]="this.emailErrors"
        ></app-ux-input>

        <app-ux-input
          controlName="password"
          type="password"
          inputmode="password"
          [label]="'usuarios.login.password_label' | translate"
          [errors]="this.passwordErrors"
        ></app-ux-input>

        <ng-content select=".auth-link-reset-password"></ng-content>

        <app-ux-checkbox
          class="ux-font-text-xs"
          *ngIf="!this.isLogin"
          class="normal"
          [label]="'usuarios.register.manual_referral' | translate"
          controlName="manual_referral"
          color="uxsecondary"
          slot="start"
        ></app-ux-checkbox>

        <app-ux-input
          *ngIf="this.showReferralCode"
          controlName="referral_code"
          type="text"
          inputmode="text"
          [label]="'usuarios.register.referral_code_label' | translate"
        ></app-ux-input>

        <ion-item class="tos_item" *ngIf="!this.isLogin">
          <ng-content select=".tos-text"></ng-content>

          <app-ux-checkbox
            *ngIf="!this.isLogin"
            class="small"
            controlName="tos"
            color="uxsecondary"
            slot="start"
          ></app-ux-checkbox>
        </ion-item>

        <ng-content select=".auth-button"></ng-content>

        <ng-content select=".auth-link"></ng-content>
      </form>
    </div>
  `,
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent implements OnInit {
  @Input()
  isLogin = false;

  @Output()
  send = new EventEmitter<any>();

  showReferralCode: boolean;

  emailErrors: ItemFormError[] = CONFIG.fieldErrors.username;

  passwordErrors: ItemFormError[] = CONFIG.fieldErrors.password;

  form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
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
    referral_code: ['', Validators.required],
    manual_referral: [false],
    tos: [false, [Validators.required, CustomValidators.mustBeTrue]],
  });

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.toggleReferralCode();
  }

  toggleReferralCode() {
    this.form.get('referral_code').disable();
    this.form.get('manual_referral').valueChanges.subscribe((val) => {
      this.showReferralCode = val;
      if (this.showReferralCode) {
        this.form.get('referral_code').enable();
      } else {
        this.form.get('referral_code').disable();
      }
    });
  }

  private initForm() {
    if (this.isLogin) {
      this.form.get('tos').disable();
    }
  }

  handleSubmit() {
    if (this.form.valid) {
      this.send.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
