import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { KriptonNetworks } from '../../constants/kripton-networks';
import { ProviderPrice } from '../provider-price/provider-price';

export class DefaultKriptonPrice implements ProviderPrice {
  kriptonNetworks = KriptonNetworks;
  constructor(
    private readonly _fiatCurrency: string,
    private readonly _cryptoCurrency: Coin,
    private readonly _mode: 'cash-in'|'cash-out',
    private readonly _httpClient: HttpClient | FakeHttpClient
  ) {}

  value(): Observable<number> {
    return this._priceByMode().pipe(
      map(
        (res) => 1 / ((parseFloat(res.data.amount_out) + parseFloat(res.data.costs)) / parseFloat(res.data.amount_in))
      )
    );
  }

  private _priceByMode() {
    return this._mode === 'cash-in' ? this._priceIn() : this._priceOut();
  }

  private _priceIn() {
    return this._price(this._mode, this._fiatCurrency, this._cryptoCurrency.value);
  }

  private _priceOut() {
    return this._price(this._mode, this._cryptoCurrency.value, this._fiatCurrency);
  }

  private _price(type: string, currency_in: string, currency_out: string): Observable<any> {
    return this._httpClient.post('https://app.kriptonmarket.com/public/calculate_amount_out', {
      currency_in,
      amount_in: 10000,
      currency_out,
      type,
      network_out: this._network(),
    });
  }

  private _network(): string {
    return this.kriptonNetworks[this._cryptoCurrency.network];
  }
}
