import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
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
        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input
            formControlName="email"
            type="email"
            inputmode="email"
          ></ion-input>
        </ion-item>
        <app-errors-form-item
          controlName="email"
          [errors]="this.emailErrors"
        ></app-errors-form-item>
        <ion-item *ngIf="!this.isLogin">
          <ion-label position="floating">{{ 'usuarios.auth_form.repeat_email' | translate }}</ion-label>
          <ion-input
            formControlName="repeat_email"
            type="email"
            inputmode="email"
          ></ion-input>
        </ion-item>
        <app-errors-form-item
          *ngIf="!this.isLogin"
          controlName="repeat_email"
          [errors]="this.repeatEmailErrors"
        ></app-errors-form-item>
        <ion-item>
          <ion-label position="floating">Password</ion-label>
          <ion-input formControlName="password" type="password"></ion-input>
        </ion-item>
        <app-errors-form-item
          controlName="password"
          [errors]="this.passwordErrors"
        ></app-errors-form-item>
        <ion-item *ngIf="!this.isLogin">
          <ion-label position="floating">{{ 'usuarios.auth_form.repeat_password' | translate }}</ion-label>
          <ion-input
            formControlName="repeat_password"
            type="password"
          ></ion-input>
        </ion-item>
        <app-errors-form-item
          *ngIf="!this.isLogin"
          controlName="repeat_password"
          [errors]="this.repeatPasswordErrors"
        ></app-errors-form-item>

        <ng-content select=".auth-button"></ng-content>

        <ng-content select=".auth-link"></ng-content>
      </form>
    </div>
  `,
  styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent implements OnInit {
  @Input()
  isLogin = false;

  @Output()
  send = new EventEmitter<any>();

  emailErrors: ItemFormError[] = CONFIG.fieldErrors.username;

  repeatEmailErrors: ItemFormError[] = [
    ...CONFIG.fieldErrors.username,
    ...CONFIG.fieldErrors.repeatUsername
  ];

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
      repeat_email: [
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
    },
    {
      validators: [
        CustomValidators.passwordMatchValidator,
        control =>
          CustomValidators.fieldsdMatchValidator(
            control,
            'email',
            'repeat_email'
          )
      ]
    }
  );

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    if (this.isLogin) {
      this.form.get('repeat_password').disable();
      this.form.get('repeat_email').disable();
    }
  }

  handleSubmit() {
    if (this.form.valid) {
      this.send.emit(this.form.value);
    }
  }
}
