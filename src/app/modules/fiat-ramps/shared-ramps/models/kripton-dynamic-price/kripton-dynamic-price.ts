import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';

export class KriptonDynamicPrice {
  constructor(
    private readonly _timer: Observable<number>,
    private readonly _fiatCurrency: string,
    private readonly _cryptoCurrency: Coin,
    private readonly _httpClient: HttpClient | FakeHttpClient
  ) {}

  public static create(
    _milliseconds: number,
    _fiatCurrency: string,
    _cryptoCurrency: Coin,
    _httpClient: HttpClient | FakeHttpClient
  ): KriptonDynamicPrice {
    return new this(timer(0, _milliseconds), _fiatCurrency, _cryptoCurrency, _httpClient);
  }

  private price(): Observable<any> {
    return this._httpClient.post('https://app.kriptonmarket.com/public/calculate_amount_out', {
      currency_in: this._fiatCurrency,
      amount_in: 1,
      currency_out: this._cryptoCurrency.value,
      type: 'cash-in',
    });
  }

  public value(): Observable<number> {
    return this._timer.pipe(
      mergeMap(() => this.price()),
      map((res) => 1 / res.data.amount_out)
    );
  }
}
