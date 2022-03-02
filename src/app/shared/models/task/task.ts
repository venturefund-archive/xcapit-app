import { ObservableOrPromise } from '../../types/observable-or-promise.type';
import { defer, isObservable, Observable } from 'rxjs';

export class Task {
  constructor(private readonly observableOrPromise: ObservableOrPromise) {}

  value(): Observable<any> {
    const task = this.observableOrPromise;
    return isObservable(task) ? task : defer(() => task());
  }
}
