import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';

import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { CustomValidatorErrors } from 'src/app/shared/validators/custom-validator-errors';

@Injectable({
    providedIn: 'root',
  })

export class RepeatedAddressValidator implements AsyncValidator {
  private _aKey = 'contact_list';
  constructor(private storage: IonicStorageService) {}

  validate = async (control: AbstractControl, err: ValidationErrors = CustomValidatorErrors.isRepeatedAddress) => {
    let contact_list = await this.storage.get(this._aKey);
    contact_list = contact_list ? contact_list : [];
    for (const contact of contact_list) {
      if (contact.address === control.value) {
       return err
      }
    }
  };
}
