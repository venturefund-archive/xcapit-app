import { ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { CustomValidatorErrors } from './custom-validator-errors';
import { isAddress } from 'ethers/lib/utils';

export class CustomValidators {
  static patternValidator(regex: RegExp, error: ValidationErrors, failWhenEmpty = false): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return failWhenEmpty ? error : null;
      }
      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }

  static hasNoSpecialCharacters(error: ValidationErrors = CustomValidatorErrors.hasSpecialCharacter): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }

      const invalid = /[^a-zA-Z\s]/.test(control.value);

      return invalid ? error : null;
    };
  }

  static countWords(value: number, error: ValidationErrors = CustomValidatorErrors.countWordsMatch): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value !== undefined && control.value.split(' ').filter((m) => m).length !== value ? error : null;
    };
  }

  static isAddress(error: ValidationErrors = CustomValidatorErrors.isAddress): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
    return isAddress(control.value) ? null : error
    };
  }

  static advancedCountWords(value: number, error: ValidationErrors = CustomValidatorErrors.countWordsMatch): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const words = control.value.match(/[a-z0-9]+/g) || [];
      const hasUppercase = /[A-Z]+/g.test(control.value)
      return hasUppercase ||  words.length !== value ? error : null;
    };
  }

  static passwordMatchValidator(
    control: AbstractControl,
    pass: string = 'password',
    rPass: string = 'repeat_password'
  ): ValidationErrors | null {
    return CustomValidators.fieldsMatchValidator(control, pass, rPass, CustomValidatorErrors.noPasswordMatch);
  }

  static newPasswordEqualsOldValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const oldPassword: string = control.get('old_password').value;
      const newPassword: string = control.get('password').value;

      if (oldPassword === newPassword) {
        control.get('password').setErrors(CustomValidatorErrors.newPasswordMatchesOld);
        return CustomValidatorErrors.newPasswordMatchesOld
      }

      return null;
    };
  }

  static fieldsMatchValidator(
    control: AbstractControl,
    controlName1: string,
    controlName2: string,
    error: ValidationErrors
  ): ValidationErrors | null {
    const field1: string = control.get(controlName1).value;
    const field2: string = control.get(controlName2).value;
    if (field1 !== field2) {
      control.get(controlName2).setErrors(error);
      return error;
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

  static lowerThanEqual(max: number, error: ValidationErrors = CustomValidatorErrors.lowerThanEqualError): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value !== undefined && (isNaN(control.value) || control.value > max) ? error : null;
    };
  }
}
