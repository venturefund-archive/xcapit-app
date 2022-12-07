import { HttpClient } from '@angular/common/http';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { EnvService } from '../../../../../../shared/services/env/env.service';
import { InvestedBalanceOf } from '../invested-balance-of.interface';
import { CacheService } from '../../../../../../shared/services/cache/cache.service';
import { InvestedBalanceResponse } from '../../invested-balance-response/invested-balance-response.interface';
import { NullInvestedBalanceResponse } from '../../invested-balance-response/null/null-invested-balance-response';
import { DefaultInvestedBalanceResponse } from '../../invested-balance-response/default/default-invested-balance-response';
import { TwoPiProduct } from '../../two-pi-product/two-pi-product.model';
import { DefaultToken } from '../../../../../swaps/shared-swaps/models/token/token';
import { RawToken } from '../../../../../swaps/shared-swaps/models/token-repo/token-repo';

export class DefaultInvestedBalanceOf implements InvestedBalanceOf {
  constructor(
    private readonly anAddress: string,
    private readonly _aProduct: TwoPiProduct,
    private readonly http: HttpClient | FakeHttpClient,
    private readonly env: EnvService,
    private readonly _cache: CacheService
  ) {}

  public async value(): Promise<InvestedBalanceResponse> {
    const investedBalanceResponse = await this.http
      .post(this._url(), this._body())
      .toPromise()
      .then((res) => this._investedBalanceResponseOf(res.data));
    await this._saveInCache(investedBalanceResponse);
    return investedBalanceResponse;
  }

  public cached(): Promise<InvestedBalanceResponse> {
    return this._cache
      .get(this._storageKey())
      .then((res) =>
        res
          ? new DefaultInvestedBalanceResponse(res, new DefaultToken(this._aProduct.token() as RawToken))
          : new NullInvestedBalanceResponse()
      );
  }

  private _storageKey() {
    return `invested_balance_${this._aProduct.id()}`;
  }

  private _saveInCache(investedBalanceResponse: InvestedBalanceResponse): Promise<void> {
    return this._cache.update(this._storageKey(), investedBalanceResponse.json());
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
          where: {holder: "${this._normalizedAddress()}", pid: ${this._aProduct.id()}}
        ) {balance balanceUSD}
      }`;
  }

  private _investedBalanceResponseOf(data: any): InvestedBalanceResponse {
    return data.flows[0]
      ? new DefaultInvestedBalanceResponse(data.flows[0], new DefaultToken(this._aProduct.token() as RawToken))
      : new NullInvestedBalanceResponse();
  }

  private _normalizedAddress(): string {
    return this.anAddress.toLowerCase();
  }
}
