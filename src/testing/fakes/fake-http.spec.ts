import { Observable, of } from 'rxjs';

export class FakeHttpClient {
  constructor(private _getReturnValue: any = {}, private _postReturnValue: any = {}) {}

  get(): Observable<any> {
    return of(this._getReturnValue);
  }

  post(): Observable<any> {
    return of(this._postReturnValue);
  }
}
