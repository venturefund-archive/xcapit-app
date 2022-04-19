import { HttpClient } from '@angular/common/http';
import { FakeHttpClient } from '../../../../../../testing/fakes/fake-http.spec';
import { environment } from '../../../../../../environments/environment';
import { Coin } from '../../interfaces/coin.interface';
import { formatUnits } from 'ethers/lib/utils';

export class CovalentBalances {
  private _valueCache: any = null;

  constructor(
    private readonly _address: string,
    private readonly _coins: Coin[],
    private readonly _http: HttpClient | FakeHttpClient,
    private readonly _baseUrl = environment.covalentApiUrl
  ) {}

  private _headers(): any {
    return { Authorization: `Basic ${btoa(environment.covalentApiKey + ':')}` };
  }

  private _url(): string {
    return `${this._baseUrl}${this._coins[0].chainId}/address/${this._address}/balances_v2/`;
  }

  private _queryParams() {
    return {
      match: `{contract_address: {$in: [${this._coins.map((coin) => coin.contract)}]}}`,
    };
  }

  public async value(): Promise<any> {
    if (!this._valueCache) {
      this._valueCache = await this._http
        .get(this._url(), {
          headers: this._headers(),
          params: this._queryParams(),
        })
        .toPromise()
        .then((res) =>
          res.data.items.reduce((balances, resItem) => {
            balances.push({
              coin: this.coinOf(resItem.contract_ticker_symbol),
              balance: this.amountOf(resItem.balance, this.coinOf(resItem.contract_ticker_symbol)),
            });
            return balances;
          }, [])
        );
    }
    return this._valueCache;
  }

  private coinOf(symbol: string): Coin {
    return this._coins.find((coin) => coin.value === symbol);
  }

  private amountOf(aWei: string, aCoin: Coin): number {
    try {
      return parseFloat(formatUnits(aWei, aCoin.decimals));
    } catch (e) {
      console.log(aWei, aCoin);
    }
  }

  public async valueOf(aCoin: Coin): Promise<any> {
    const balance = await this.value().then((balances) =>
      balances.find((balance) => balance.coin.value === aCoin.value)
    );
    return balance ?? { balance: 0, coin: aCoin };
  }
}
