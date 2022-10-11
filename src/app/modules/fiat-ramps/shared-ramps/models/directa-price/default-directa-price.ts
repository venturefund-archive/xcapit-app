import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Coin } from "src/app/modules/wallets/shared-wallets/interfaces/coin.interface";
import { FiatRampsService } from "../../services/fiat-ramps.service";


export interface DirectaPrice {
  value(): Observable<number>;
}


export class DefaultDirectaPrice implements DirectaPrice {

  constructor(
    private readonly _fiatCurrency: string,
    private readonly _cryptoCurrency: Coin,
    private readonly _fiatRamps: FiatRampsService
  ) {}

  value(): Observable<number> {
    return this._fiatRamps
      .getDirectaExchangeRate(this._fiatCurrency, this._cryptoCurrency.value, 1)
      .pipe(map((res) => res.fx_rate));
  }
}

export class FakeDirectaPrice implements DirectaPrice {
  constructor(private _aReturnValue: number) {}

  value(): Observable<number> {
    return of(this._aReturnValue);
  }
}
