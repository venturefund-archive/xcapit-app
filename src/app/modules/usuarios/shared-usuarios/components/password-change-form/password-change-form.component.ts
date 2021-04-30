import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { CustomValidatorErrors } from 'src/app/shared/validators/custom-validator-errors';
import { ItemFormError } from 'src/app/shared/models/item-form-error';
import { CONFIG } from 'src/app/config/app-constants.config';

@Component({
  selector: 'app-password-change-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="this.form" (ngSubmit)="this.handleSubmit()" class="ux_main">
      <div class="ion-padding-start ion-padding-end ux_content">
        <app-ux-input
          controlName="actual_password"
          type="password"
          [label]="'usuarios.password_change_form.actual_password' | translate"
          inputmode="password"
        ></app-ux-input>

        <app-ux-input
          controlName="password"
          type="password"
          [label]="'usuarios.password_change_form.new_password' | translate"
          inputmode="password"
          [errors]="this.passwordErrors"
        ></app-ux-input>

        <app-ux-input
          controlName="repeat_password"
          type="password"
          [label]="'usuarios.password_change_form.repeat_new_password' | translate"
          inputmode="password"
          [errors]="this.repeatPasswordErrors"
        ></app-ux-input>
      </div>

      <ng-content select=".submit-button"></ng-content>
    </form>
  `,
  styleUrls: ['./password-change-form.component.scss'],
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

  constructor(private formBuilder: FormBuilder) {}

  handleSubmit() {
    if (this.form.valid) {
      this.send.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
