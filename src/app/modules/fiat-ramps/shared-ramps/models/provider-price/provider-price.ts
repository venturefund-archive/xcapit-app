import { Observable, of } from 'rxjs';

export interface ProviderPrice {
  value(): Observable<number>;
}

export class FakeProviderPrice implements ProviderPrice {
    constructor(private _aReturnValue: number) {}
  
    value(): Observable<number> {
      return of(this._aReturnValue);
    }
  }
  