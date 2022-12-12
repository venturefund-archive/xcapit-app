import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../../../../../shared/services/env/env.service';
import { DefaultTotalInvestedBalanceOf } from '../default/default-total-invested-balance-of';
import { CacheService } from '../../../../../../shared/services/cache/cache.service';
import { TwoPiProduct } from '../../two-pi-product/two-pi-product.model';

@Injectable({ providedIn: 'root' })
export class TotalInvestedBalanceOfInjectable {
  constructor(private _cacheService: CacheService, private _http: HttpClient, private _env: EnvService) {}

  create(
    anAddress: string,
    twoPiProducts: TwoPiProduct[],
    cacheService: CacheService = this._cacheService,
    http: HttpClient = this._http,
    env: EnvService = this._env
  ): DefaultTotalInvestedBalanceOf {
    return new DefaultTotalInvestedBalanceOf(anAddress, twoPiProducts, cacheService, http, env);
  }
}
