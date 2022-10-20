import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Coin } from "src/app/modules/wallets/shared-wallets/interfaces/coin.interface";
import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { ProviderPrice } from "../provider-price/provider-price";

export class DefaultKriptonPrice implements ProviderPrice {
  constructor(
    private readonly _fiatCurrency: string,
    private readonly _cryptoCurrency: Coin,
    private readonly _httpClient: HttpClient | FakeHttpClient
  ){ }

  value(): Observable<number> {
    return this._price().pipe(map(res => 1 / res.data.amount_out));
  }

  private _price(): Observable<any> {
    return this._httpClient.post('https://app.kriptonmarket.com/public/calculate_amount_out', {
      currency_in: this._fiatCurrency,
      amount_in: 1,
      currency_out: this._cryptoCurrency.value,
      type: 'cash-in',
    });
  }
}

