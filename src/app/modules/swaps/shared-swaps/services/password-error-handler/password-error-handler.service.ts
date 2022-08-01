import { Injectable } from '@angular/core';
import { PasswordErrorMsgs } from '../../models/password/password-error-msgs';


@Injectable({
  providedIn: 'root',
})
export class PasswordErrorHandlerService {
  constructor() {}

  handlePasswordError(error: any, callback: CallableFunction) {
    if (new PasswordErrorMsgs().isInvalidError(error)) {
      callback();
    }
  }
}
