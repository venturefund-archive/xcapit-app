import { Observable } from 'rxjs';

export type Task = Observable<any> | (() => Promise<any>);
