import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { CustomValidatorErrors } from 'src/app/shared/validators/custom-validator-errors';
import { ItemFormError } from 'src/app/shared/models/item-form-error';
import { CONFIG } from 'src/app/config/app-constants.config';

@Component({
  selector: 'app-password-change-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()">
      <ion-item-group>
        <div class="ion-padding-start ion-padding-end">
          <ion-item>
            <ion-label position="floating">
              {{ 'usuarios.password_change_form.actual_password' | translate }}
            </ion-label>
            <ion-input
              formControlName="actual_password"
              type="password"
            ></ion-input>
          </ion-item>
          <app-errors-form-item
            controlName="actual_password"
          ></app-errors-form-item>
          <ion-item>
            <ion-label position="floating">
              {{ 'usuarios.password_change_form.new_password' | translate }}
            </ion-label>
            <ion-input formControlName="password" type="password"></ion-input>
          </ion-item>
          <app-errors-form-item
            controlName="password"
            [errors]="this.passwordErrors"
          ></app-errors-form-item>
          <ion-item>
            <ion-label position="floating">{{
              'usuarios.password_change_form.repeat_new_password' | translate
            }}</ion-label>
            <ion-input
              formControlName="repeat_password"
              type="password"
            ></ion-input>
          </ion-item>
          <app-errors-form-item
            controlName="repeat_password"
            [errors]="this.repeatPasswordErrors"
          ></app-errors-form-item>
        </div>

        <ng-content select=".submit-button"></ng-content>
      </ion-item-group>
    </form>
  `,
  styleUrls: ['./password-change-form.component.scss']
})
export class PasswordChangeFormComponent {
  @Output()
  send = new EventEmitter<any>();

  form: FormGroup = this.formBuilder.group(
    {
      actual_password: ['', [Validators.required]],
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
      validators: [CustomValidators.passwordMatchValidator]
    }
  );

  passwordErrors: ItemFormError[] = CONFIG.fieldErrors.password;

  repeatPasswordErrors: ItemFormError[] = [
    ...CONFIG.fieldErrors.repeatPassword,
    ...CONFIG.fieldErrors.password
  ];

  constructor(private formBuilder: FormBuilder) {}

  handleSubmit() {
    if (this.form.valid) {
      this.send.emit(this.form.value);
    }
  }
}
