import { Observable } from 'rxjs';

export type ObservableOrPromise = Observable<any> | (() => Promise<any>);
