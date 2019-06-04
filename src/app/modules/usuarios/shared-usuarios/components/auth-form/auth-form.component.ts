import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
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
          <ion-input formControlName="email" type="text"></ion-input>
        </ion-item>
        <app-errors-form-item
          controlName="email"
          [errors]="this.emailErrors"
        ></app-errors-form-item>
        <ion-item>
          <ion-label position="floating">Password</ion-label>
          <ion-input formControlName="password" type="password"></ion-input>
        </ion-item>
        <app-errors-form-item
          controlName="password"
          [errors]="this.passwordErrors"
        ></app-errors-form-item>
        <ion-item>
          <ion-label position="floating">Confirmar Password</ion-label>
          <ion-input
            formControlName="repeatPassword"
            type="password"
          ></ion-input>
        </ion-item>
        <app-errors-form-item
          controlName="repeatPassword"
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
      repeatPassword: [
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
      validator: CustomValidators.passwordMatchValidator
    }
  );

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {}

  handleSubmit() {
    if (this.form.valid) {
      this.send.emit(this.form.value);
    }
  }
}
