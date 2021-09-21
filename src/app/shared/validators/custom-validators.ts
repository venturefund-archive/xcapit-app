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

  static countWords(value: number, error: ValidationErrors = CustomValidatorErrors.countWordsMatch): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value !== undefined && control.value.split(' ').filter((m) => m).length !== value ? error : null;
    };
  }

  static passwordMatchValidator(
    control: AbstractControl,
    pass: string = 'password',
    rPass: string = 'repeat_password'
  ) {
    CustomValidators.fieldsMatchValidator(control, pass, rPass, CustomValidatorErrors.noPasswordMatch);
  }

  static fieldsMatchValidator(
    control: AbstractControl,
    controlName1: string,
    controlName2: string,
    error: ValidationErrors
  ) {
    const field1: string = control.get(controlName1).value;
    const field2: string = control.get(controlName2).value;
    if (field1 !== field2) {
      control.get(controlName2).setErrors(error);
    } else {
      control.get(controlName2).setErrors(null);
    }
  }

  static mustBeTrue(
    control: AbstractControl,
    error: ValidationErrors = CustomValidatorErrors.notChecked
  ): ValidationErrors | null {
    return !control.value ? error : null;
  }

  static greaterThan(min: number, error: ValidationErrors = CustomValidatorErrors.greaterThanError): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value !== undefined && (isNaN(control.value) || control.value <= min) ? error : null;
    };
  }
}
