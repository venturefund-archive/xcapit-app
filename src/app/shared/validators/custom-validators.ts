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
    rPass: string = 'repeatPassword'
  ) {
    const password: string = control.get(pass).value;
    const repeatPassword: string = control.get(rPass).value;
    if (password !== repeatPassword) {
      control.get(rPass).setErrors(CustomValidatorErrors.noPasswordMatch);
    }
  }
}
