import { HttpClient } from '@angular/common/http';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { EnvService } from '../../../../../../shared/services/env/env.service';
import { InvestedBalanceOf } from '../invested-balance-of.interface';

export class DefaultInvestedBalanceOf implements InvestedBalanceOf {
  constructor(
    private readonly anAddress: string,
    private readonly aPid: number,
    private readonly http: HttpClient | FakeHttpClient,
    private readonly env: EnvService
  ) {}

  public async value(): Promise<number> {
    return this.http
      .post(this._url(), this._body())
      .toPromise()
      .then((res) => this._parseBalance(res.data));
  }

  private _url(): string {
    return this.env.byKey('twoPiGraphqlUrl');
  }

  private _body(): string {
    return JSON.stringify({ query: this._query() });
  }

  private _query(): string {
    return `query{
        flows(
          first: 1 orderBy: timestamp orderDirection: desc
          where: {holder: "${this._normalizedAddress()}", pid: ${this.aPid}}
        ) {balance balanceUSD}
      }`;
  }

  private _parseBalance(data): number {
    return data.flows[0] ? parseFloat(data.flows[0].balanceUSD) : 0;
  }

  private _normalizedAddress(): string {
    return this.anAddress.toLowerCase();
  }
}
