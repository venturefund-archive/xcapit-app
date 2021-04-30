import { ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { CustomValidatorErrors } from './custom-validator-errors';

export class CustomValidators {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }

  static passwordMatchValidator(
    control: AbstractControl,
    pass: string = 'password',
    rPass: string = 'repeat_password'
  ) {
    CustomValidators.fieldsdMatchValidator(control, pass, rPass, CustomValidatorErrors.noPasswordMatch);
  }

  static fieldsdMatchValidator(
    control: AbstractControl,
    controlName1: string,
    controlName2: string,
    error: ValidationErrors = CustomValidatorErrors.noFieldsMatch
  ) {
    const field1: string = control.get(controlName1).value;
    const field2: string = control.get(controlName2).value;
    if (field1 !== field2) {
      control.get(controlName2).setErrors(error);
    }
  }

  static mustBeTrue(control: AbstractControl): { [key: string]: boolean } {
    const check: { [key: string]: boolean } = {};
    if (!control.value) {
      check.notChecked = true;
    }
    return check;
  }
}
