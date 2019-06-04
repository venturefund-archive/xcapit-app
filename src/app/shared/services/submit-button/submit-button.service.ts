import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubmitButtonService {

  private disabledState = new ReplaySubject<boolean>(1);

  get isDisabled() {
    return this.disabledState.asObservable();
  }

  disabled() {
    this.disabledState.next(true);
  }

  enabled() {
    this.disabledState.next(false);
  }
}
