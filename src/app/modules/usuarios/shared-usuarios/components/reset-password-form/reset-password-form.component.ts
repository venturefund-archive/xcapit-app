import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemFormError } from 'src/app/shared/models/item-form-error';
import { CONFIG } from 'src/app/config/app-constants.config';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { CustomValidatorErrors } from 'src/app/shared/validators/custom-validator-errors';

@Component({
  selector: 'app-reset-password-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `

    <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
      <div *ngIf="!this.isReset">
        <app-ux-title class="ion-padding-top ion-margin-top">
          <div class="ion-margin-top">
            {{ 'usuarios.reset_password.title' | translate }}
          </div>
        </app-ux-title>

        <app-ux-text>
          <div class="ion-margin-top ion-margin-bottom">
            {{ 'usuarios.reset_password.text_before' | translate }}
          </div>
        </app-ux-text>
        
        <app-ux-input
          controlName="email"
          type="email"
          [label]="'usuarios.reset_password.title_email' | translate"
          [placeholder]="'usuarios.reset_password.email_placeholder_label' | translate"
          inputmode="email"
          [errors]="this.emailErrors"
        ></app-ux-input>
      </div>

      <div *ngIf="this.isReset">
        <app-ux-input
          controlName="password"
          type="password"
          [label]="'usuarios.reset_password_form.new_password' | translate"
          inputmode="password"
          [errors]="this.passwordErrors"
        ></app-ux-input>

        <app-ux-input
          controlName="repeat_password"
          type="password"
          [label]="'usuarios.reset_password_form.repeat_new_password' | translate"
          inputmode="password"
          [errors]="this.repeatPasswordErrors"
        ></app-ux-input>
      </div>

      <ng-content select=".submit-button"></ng-content>

      <ng-content select=".other-links"></ng-content>
    </form>
  `,
  styleUrls: ['./reset-password-form.component.scss']
})
export class ResetPasswordFormComponent implements OnInit {
  @Input()
  isReset: boolean;

  @Output()
  send = new EventEmitter<any>();

  emailErrors: ItemFormError[] = CONFIG.fieldErrors.username;

  passwordErrors: ItemFormError[] = CONFIG.fieldErrors.password;

  repeatPasswordErrors: ItemFormError[] = [
    ...CONFIG.fieldErrors.repeatPassword,
    ...CONFIG.fieldErrors.password
  ];

  form: FormGroup = this.formBuilder.group(
    {
      email: [
        '',
        [
          Validators.email,
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
          CustomValidators.patternValidator(
            /\d/,
            CustomValidatorErrors.hasNumber
          ),
          CustomValidators.patternValidator(
            /[A-Z]/,
            CustomValidatorErrors.hasCapitalCase
          ),
          CustomValidators.patternValidator(
            /[a-z]/,
            CustomValidatorErrors.hasSmallCase
          )
        ]
      ],
      repeat_password: ['']
    },
    {
      validators: [
        CustomValidators.passwordMatchValidator
      ]
    }
  );

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  handleSubmit() {
    if (this.form.valid) {
      this.send.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  initForm() {
    if (this.isReset) {
      this.form.get('email').disable();
    } else {
      this.form.get('password').disable();
      this.form.get('repeat_password').disable();
    }
  }
}
