import { Observable, of } from 'rxjs';

export class FakeFiatRampsService {

  constructor(private _returnValue = { data: { to: 'asd' } }) {}

  public getAddressByVoucher(anExternalCode: string): Observable<any> {
    return of(this._returnValue);
  }
}
