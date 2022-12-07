import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../../../../../shared/services/env/env.service';
import { InvestedBalanceOf } from '../invested-balance-of.interface';
import { DefaultInvestedBalanceOf } from '../default/default-invested-balance-of';
import { CacheService } from '../../../../../../shared/services/cache/cache.service';
import { TwoPiProduct } from '../../two-pi-product/two-pi-product.model';

@Injectable({ providedIn: 'root' })
export class InvestedBalanceOfInjectable {
  constructor(private http: HttpClient, private env: EnvService, private cacheService: CacheService) {}

  create(
    anAddress: string,
    aProduct: TwoPiProduct,
    http: HttpClient = this.http,
    env: EnvService = this.env,
    cache: CacheService = this.cacheService
  ): InvestedBalanceOf {
    return new DefaultInvestedBalanceOf(anAddress, aProduct, http, env, cache);
  }
}
