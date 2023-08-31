import { HttpClient } from '@angular/common/http';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { environment } from '../../../../../../../environments/environment';
import { Coin } from '../../../interfaces/coin.interface';
import { Balances } from '../balances.interface';
import { Tokens } from '../../../../../swaps/shared-swaps/models/tokens/tokens';
import { Token } from '../../../../../swaps/shared-swaps/models/token/token';
import { AmountOf } from '../../blockchain-tx/amount-of/amount-of';

export class CovalentBalances implements Balances {
  private _valueCache: any = null;

  constructor(
    private readonly _address: string,
    private readonly _tokens: Tokens,
    private readonly _http: HttpClient | FakeHttpClient,
    private readonly _baseUrl = environment.covalentApiUrl
  ) {}

  private _headers(): any {
    return { Authorization: `Basic ${btoa(environment.covalentApiKey + ':')}` };
  }

  private async _url(): Promise<string> {
    return `${this._baseUrl}${(await this._tokens.value())[0].blockchainId()}/address/${this._address}/balances_v2/`;
  }

  private async _contracts() {
    return (await this._tokens.value()).map((token) => `'${token.address()}'`);
  }

  private async _queryParams() {
    return {
      match: `{contract_address: {$in: [${await this._contracts()}]}}`,
    };
  }

  public async value(): Promise<any> {
    if (!this._valueCache) {
      this._valueCache = await this._http
        .get(await this._url(), {
          headers: this._headers(),
          params: await this._queryParams(),
        })
        .toPromise()
        .then(async (res) => {
          const balances = [];
          for (const item of res.data.items) {
            balances.push({
              coin: (await this.tokenOf(item.contract_address)).json(),
              balance: new AmountOf(item.balance, await this.tokenOf(item.contract_address)).value(),
            });
          }
          return balances;
        });
    }
    return this._valueCache;
  }

  private async tokenOf(aContractAddress: string): Promise<Token> {
    return (await this._tokens.value()).find((token) => token.address() === aContractAddress);
  }

  public async valueOf(aCoin: Coin): Promise<any> {
    const balance = await this.value().then((balances) =>
      balances.find((balance) => balance.coin.value === aCoin.value)
    );
    return balance ?? { balance: 0, coin: aCoin };
  }
}
