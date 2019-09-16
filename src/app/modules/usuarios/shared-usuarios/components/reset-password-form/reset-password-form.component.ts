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
    <div>
      <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()">
        <ion-item *ngIf="!this.isReset">
          <ion-label position="floating">Email</ion-label>
          <ion-input
            formControlName="email"
            type="email"
            inputmode="email"
          ></ion-input>
        </ion-item>
        <app-errors-form-item
          *ngIf="!this.isReset"
          controlName="email"
          [errors]="this.emailErrors"
        ></app-errors-form-item>
        <ion-item *ngIf="this.isReset">
          <ion-label position="floating">
            {{ 'usuarios.reset_password_form.new_password' | translate }}
          </ion-label>
          <ion-input formControlName="password" type="password"></ion-input>
        </ion-item>
        <app-errors-form-item
          *ngIf="this.isReset"
          controlName="password"
          [errors]="this.passwordErrors"
        ></app-errors-form-item>
        <ion-item *ngIf="this.isReset">
          <ion-label position="floating">{{
            'usuarios.reset_password_form.repeat_new_password' | translate
          }}</ion-label>
          <ion-input
            formControlName="repeat_password"
            type="password"
          ></ion-input>
        </ion-item>
        <app-errors-form-item
          *ngIf="this.isReset"
          controlName="repeat_password"
          [errors]="this.repeatPasswordErrors"
        ></app-errors-form-item>

        <ng-content select=".submit-button"></ng-content>

        <ng-content select=".other-links"></ng-content>
      </form>
    </div>
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

  form: FormGroup = this.formBuilder.group({
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
    repeat_password: [
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
    ]
  });

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  handleSubmit() {
    if (this.form.valid) {
      this.send.emit(this.form.value);
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
