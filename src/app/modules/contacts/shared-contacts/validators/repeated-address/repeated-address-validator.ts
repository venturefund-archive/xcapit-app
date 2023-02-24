import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { CustomValidatorErrors } from 'src/app/shared/validators/custom-validator-errors';

@Injectable({
  providedIn: 'root',
})
export class RepeatedAddressValidator {
  static validate(storage: IonicStorageService, anExceptionAddress?: string, _aKey = 'contact_list'): AsyncValidatorFn {
    return async (control: AbstractControl, err: ValidationErrors = CustomValidatorErrors.isRepeatedAddress) => {
      let contact_list = await storage.get(_aKey);
      contact_list = contact_list ? contact_list : [];
      for (const contact of contact_list) {
        if (contact.address === control.value && control.value !== anExceptionAddress) {
          return err;
        }
      }
      return null;
    };
  }
}
