import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { timer } from 'rxjs/internal/observable/timer';
import { map, mergeMap } from 'rxjs/operators';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { FiatRampsService } from '../../services/fiat-ramps.service';

export class DirectaPrice {
  constructor(
    private readonly _timer: Observable<number>,
    private readonly _fiatCurrency: string,
    private readonly _cryptoCurrency: Coin,
    private readonly _httpClient: HttpClient | FakeHttpClient,
    private readonly _fiatRamps: FiatRampsService
  ) {}

  public static create(
    _milliseconds: number,
    _fiatCurrency: string,
    _cryptoCurrency: Coin,
    _httpClient: HttpClient | FakeHttpClient,
    _fiatRamps: FiatRampsService
  ): DirectaPrice {
    return new this(timer(0, _milliseconds),_fiatCurrency, _cryptoCurrency, _httpClient, _fiatRamps);
  }

  private price(): Observable<any> {
    return this._fiatRamps.getDirectaExchangeRate(this._fiatCurrency, this._fiatCurrency, 1)
  }

  public value(): Observable<number> {
    return this._timer.pipe(
      mergeMap(() => this.price()),
      map((res) =>res.data.fx_rate)
    );
  }
}
