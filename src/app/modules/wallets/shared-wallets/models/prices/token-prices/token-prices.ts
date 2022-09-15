import { Coin } from '../../../interfaces/coin.interface';
import { HttpClient } from '@angular/common/http';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { environment } from '../../../../../../../environments/environment';
import { Prices } from '../prices.interface';
import { Tokens } from 'src/app/modules/swaps/shared-swaps/models/tokens/tokens';

export class TokenPrices implements Prices {
  private _valueCache: any = null;

  constructor(
    private readonly _tokens: Tokens,
    private readonly _http: HttpClient | FakeHttpClient,
    private readonly _url = environment.apiUrl
  ) {}

  public async value(): Promise<any> {
    if (!this._valueCache) {
      this._valueCache = await this._http
        .post(`${this._url}/wallet/get_symbol_prices`, {
          bases: (await this._tokens.value()).map((token) => token.symbol()),
        })
        .toPromise()
        .then((res) => res.prices);
    }
    return this._valueCache;
  }

  public valueOf(aCoin: Coin) {
    return this.value().then((prices) => prices[aCoin.value]);
  }
}
