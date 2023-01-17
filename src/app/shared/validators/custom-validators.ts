import { ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { CustomValidatorErrors } from './custom-validator-errors';
import { isAddress } from 'ethers/lib/utils';
import isExists from 'date-fns/isExists';
import { PublicKey } from '@solana/web3.js';

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
      return isAddress(control.value) ? null : error;
    };
  }
  static isAddressSolana(error: ValidationErrors = CustomValidatorErrors.isAddressSolana): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      try {
        const address = control.value;
        const publicKey = new PublicKey(address);
        const isSolana = PublicKey.isOnCurve(publicKey.toBuffer());
        return isSolana ? null : error;
      } catch (err) {
        return error;
      }
    };
  }

  static advancedCountWords(
    value: number,
    error: ValidationErrors = CustomValidatorErrors.countWordsMatch
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const words = control.value.match(/[a-z0-9]+/g) || [];
      const hasUppercase = /[A-Z]+/g.test(control.value);
      return hasUppercase || words.length !== value ? error : null;
    };
  }
  static isDate(error: ValidationErrors = CustomValidatorErrors.isDate): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value !== undefined) {
        const items = control.value.split('/');
        const [month, day, year] = items;
        if (items.length !== 3) return error;
        if (Number(year) < 1900) return error;
        return isExists(Number(year), Number(month - 1), Number(day)) ? null : error;
      }
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
        return CustomValidatorErrors.newPasswordMatchesOld;
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

  static greaterOrEqualThan(
    min: number,
    error: ValidationErrors = CustomValidatorErrors.greaterOrEqualThanError
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlValue = parseFloat(control.value);
      return controlValue !== undefined && (isNaN(controlValue) || controlValue < min) ? error : null;
    };
  }

  static lowerThanEqual(max: number, error: ValidationErrors = CustomValidatorErrors.lowerThanEqualError): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value !== undefined && (isNaN(control.value) || control.value > max) ? error : null;
    };
  }
}
