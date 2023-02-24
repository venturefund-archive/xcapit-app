import { Transfers } from '../transfers';
import { Injectable } from '@angular/core';
import { RawToken } from '../../../../../swaps/shared-swaps/models/token-repo/token-repo';
import { DefaultCovalentRepo } from '../../covalent-repo/default/default-covalent-repo';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../../../../../shared/services/env/env.service';
import { CacheService } from 'src/app/shared/services/cache/cache.service';

@Injectable({ providedIn: 'root' })
export class TransfersFactory {
  constructor(private http: HttpClient, private env: EnvService, private cache: CacheService) {}

  public create(_aToken: RawToken, _anAddress: string, _cache: CacheService = this.cache): Transfers {
    return new Transfers(_aToken, _anAddress, new DefaultCovalentRepo(this.http, this.env), _cache);
  }
}
