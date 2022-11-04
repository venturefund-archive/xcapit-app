import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../../../../../shared/services/env/env.service';
import { TotalInvestedBalanceOf } from '../default/total-invested-balance-of';
import { CacheService } from '../../../../../../shared/services/cache/cache.service';

@Injectable({ providedIn: 'root' })
export class TotalInvestedBalanceOfInjectable {
  constructor(private _cacheService: CacheService, private _http: HttpClient, private _env: EnvService) {}

  create(anAddress: string, pids: number[]): TotalInvestedBalanceOf {
    return new TotalInvestedBalanceOf(anAddress, pids, this._cacheService, this._http, this._env);
  }
}
