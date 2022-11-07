import { CacheService } from '../../../../../../shared/services/cache/cache.service';
import { HttpClient } from '@angular/common/http';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { EnvService } from '../../../../../../shared/services/env/env.service';
import { DefaultInvestedBalanceOf } from '../../invested-balance-of/default/default-invested-balance-of';
import { TotalInvestedBalanceOf } from '../total-invested-balance-of.interface';

export class DefaultTotalInvestedBalanceOf implements TotalInvestedBalanceOf {
  private readonly _storageKey = 'total_invested_balance';
  constructor(
    private readonly _anAddress: string,
    private readonly _pids: number[],
    private readonly _cache: CacheService,
    private readonly _http: HttpClient | FakeHttpClient,
    private readonly _env: EnvService
  ) {}

  async value(): Promise<number> {
    const balance = await this._pids.reduce(
      async (total, pid) => (await total) + (await this._productBalance(pid)),
      Promise.resolve(0)
    );
    await this._saveInCache(balance);
    return balance;
  }

  cached(): Promise<number> {
    return this._cache.get(this._storageKey).then((res) => (res ? res.balance : undefined));
  }

  private _saveInCache(balance: number): Promise<void> {
    return this._cache.update(this._storageKey, { balance });
  }

  private _productBalance(pid: number) {
    return new DefaultInvestedBalanceOf(this._anAddress, pid, this._http, this._env).value();
  }
}
