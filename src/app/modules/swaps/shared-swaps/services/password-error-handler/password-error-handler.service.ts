import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordErrorHandlerService {

  constructor() { }

  handlePasswordError(error: any , callback: CallableFunction){
    if (this.isInvalidPasswordError(error)) callback();
  }

  private isInvalidPasswordError(error) {
    return error.message === 'invalid password';
  }
}
